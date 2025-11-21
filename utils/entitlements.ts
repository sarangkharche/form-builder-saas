import { createUpdateClient } from "@/utils/update/server";
import { createClient as createSupabaseClient } from "@/utils/supabase/server";

export interface FormLimits {
  maxForms: number;
  maxSubmissionsPerMonth: number;
  hasEmailNotifications: boolean;
  hasUnlimitedForms: boolean;
  hasUnlimitedSubmissions: boolean;
}

export async function getUserFormLimits(): Promise<FormLimits> {
  try {
    const updateClient = await createUpdateClient();

    // Check if user has pro subscription
    const hasPro = await updateClient.entitlements.check("pro");

    if (hasPro) {
      return {
        maxForms: Infinity,
        maxSubmissionsPerMonth: Infinity,
        hasEmailNotifications: true,
        hasUnlimitedForms: true,
        hasUnlimitedSubmissions: true,
      };
    }
  } catch (error) {
    console.error("Error checking entitlements:", error);
  }

  // Free tier limits
  return {
    maxForms: 1,
    maxSubmissionsPerMonth: 50,
    hasEmailNotifications: false,
    hasUnlimitedForms: false,
    hasUnlimitedSubmissions: false,
  };
}

export async function canCreateForm(): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getUserFormLimits();

  if (limits.hasUnlimitedForms) {
    return { allowed: true };
  }

  // Count user's forms
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, reason: "Not authenticated" };
  }

  const { count, error } = await supabase
    .from("forms")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error counting forms:", error);
    return { allowed: false, reason: "Error checking limits" };
  }

  if ((count || 0) >= limits.maxForms) {
    return {
      allowed: false,
      reason: `Free plan allows ${limits.maxForms} form. Upgrade to Pro for unlimited forms.`,
    };
  }

  return { allowed: true };
}

export async function getSubmissionCount(
  userId: string,
  formId?: string
): Promise<number> {
  const supabase = await createSupabaseClient();

  // Get count for the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let query = supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .gte("submitted_at", startOfMonth.toISOString());

  if (formId) {
    query = query.eq("form_id", formId);
  } else {
    // Count all submissions for user's forms
    const { data: userForms } = await supabase
      .from("forms")
      .select("id")
      .eq("user_id", userId);

    if (!userForms || userForms.length === 0) {
      return 0;
    }

    query = query.in(
      "form_id",
      userForms.map((f) => f.id)
    );
  }

  const { count } = await query;
  return count || 0;
}

export async function hasReachedSubmissionLimit(): Promise<{
  reached: boolean;
  current: number;
  limit: number;
}> {
  const limits = await getUserFormLimits();

  if (limits.hasUnlimitedSubmissions) {
    return { reached: false, current: 0, limit: Infinity };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { reached: true, current: 0, limit: 0 };
  }

  const current = await getSubmissionCount(user.id);

  return {
    reached: current >= limits.maxSubmissionsPerMonth,
    current,
    limit: limits.maxSubmissionsPerMonth,
  };
}
