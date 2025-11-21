"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormField, FormSettings } from "@/types/forms";

export async function createForm(formData: {
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("forms")
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      fields: formData.fields,
      settings: formData.settings,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/protected/forms");
  return data;
}

export async function updateForm(
  formId: string,
  formData: {
    name: string;
    description?: string;
    fields: FormField[];
    settings: FormSettings;
    is_active?: boolean;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("forms")
    .update({
      name: formData.name,
      description: formData.description,
      fields: formData.fields,
      settings: formData.settings,
      is_active: formData.is_active,
    })
    .eq("id", formId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/protected/forms");
  revalidatePath(`/protected/forms/${formId}/edit`);
  return data;
}

export async function deleteForm(formId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("forms")
    .delete()
    .eq("id", formId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/protected/forms");
}

export async function submitForm(formId: string, data: Record<string, any>) {
  const supabase = await createClient();

  // Check if form exists and is active, get form details for email
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("id, is_active, name, settings")
    .eq("id", formId)
    .single();

  if (formError || !form) {
    throw new Error("Form not found");
  }

  if (!form.is_active) {
    throw new Error("Form is not accepting submissions");
  }

  // Insert submission
  const { error } = await supabase
    .from("submissions")
    .insert({
      form_id: formId,
      data,
    });

  if (error) {
    throw new Error(error.message);
  }

  // Send email notification if configured (Pro feature)
  if (form.settings?.notifyEmail) {
    try {
      const { sendSubmissionNotification } = await import("@/utils/email");
      await sendSubmissionNotification(form.settings.notifyEmail, form.name, data);
    } catch (error) {
      console.error("Failed to send email notification:", error);
      // Don't throw error - submission already succeeded
    }
  }

  return { success: true };
}
