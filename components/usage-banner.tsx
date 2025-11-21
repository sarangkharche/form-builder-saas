import { getUserFormLimits, getSubmissionCount } from "@/utils/entitlements";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Crown } from "lucide-react";

export async function UsageBanner() {
  const limits = await getUserFormLimits();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Count forms
  const { count: formCount } = await supabase
    .from("forms")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Count submissions this month
  const submissionCount = await getSubmissionCount(user.id);

  // If Pro user, show simple badge
  if (limits.hasUnlimitedForms) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-semibold text-purple-900">Pro Plan</p>
              <p className="text-sm text-purple-700">
                Unlimited forms & submissions
              </p>
            </div>
          </div>
          <Link href="/protected/subscription">
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Free user - show usage
  const formsUsagePercent = ((formCount || 0) / limits.maxForms) * 100;
  const submissionsUsagePercent =
    (submissionCount / limits.maxSubmissionsPerMonth) * 100;

  const isNearLimit =
    formsUsagePercent >= 80 || submissionsUsagePercent >= 80;

  return (
    <Card className={isNearLimit ? "border-yellow-200 bg-yellow-50" : ""}>
      <CardContent className="py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isNearLimit && <AlertCircle className="h-5 w-5 text-yellow-600" />}
            <p className="font-semibold">Free Plan Usage</p>
          </div>
          <Link href="/protected/pricing">
            <Button size="sm">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade to Pro
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Forms</span>
              <span className="font-medium">
                {formCount || 0} / {limits.maxForms}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  formsUsagePercent >= 100
                    ? "bg-red-500"
                    : formsUsagePercent >= 80
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(formsUsagePercent, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Submissions this month</span>
              <span className="font-medium">
                {submissionCount} / {limits.maxSubmissionsPerMonth}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  submissionsUsagePercent >= 100
                    ? "bg-red-500"
                    : submissionsUsagePercent >= 80
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min(submissionsUsagePercent, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
