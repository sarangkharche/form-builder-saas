import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FormBuilder } from "@/components/form-builder";
import { canCreateForm } from "@/utils/entitlements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NewFormPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user can create a form
  const { allowed, reason } = await canCreateForm();

  if (!allowed) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle>Form Limit Reached</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{reason}</p>
            <div className="flex gap-4">
              <Link href="/protected/pricing">
                <Button>Upgrade to Pro</Button>
              </Link>
              <Link href="/protected/forms">
                <Button variant="outline">Back to Forms</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <p className="text-muted-foreground mt-2">
          Build your custom form by adding fields
        </p>
      </div>

      <FormBuilder mode="create" />
    </div>
  );
}
