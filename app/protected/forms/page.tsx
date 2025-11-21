import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Eye, Edit, Trash2, Copy } from "lucide-react";
import { DeleteFormButton } from "@/components/delete-form-button";
import { CopyLinkButton } from "@/components/copy-link-button";
import { UsageBanner } from "@/components/usage-banner";

export default async function FormsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's forms with submission counts
  const { data: forms, error } = await supabase
    .from("forms")
    .select(`
      *,
      submissions:submissions(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching forms:", error);
  }

  const formsWithCount = forms?.map(form => ({
    ...form,
    submission_count: form.submissions?.[0]?.count || 0
  })) || [];

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your forms
          </p>
        </div>
        <Link href="/protected/forms/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      <UsageBanner />

      {formsWithCount.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">No forms yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Get started by creating your first form. It only takes a few seconds!
              </p>
              <Link href="/protected/forms/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formsWithCount.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{form.name}</CardTitle>
                    {form.description && (
                      <CardDescription className="mt-2">
                        {form.description}
                      </CardDescription>
                    )}
                  </div>
                  {!form.is_active && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submissions</span>
                    <span className="font-semibold">{form.submission_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fields</span>
                    <span className="font-semibold">{form.fields?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-semibold">
                      {new Date(form.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/f/${form.id}`} target="_blank" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/protected/forms/${form.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/protected/forms/${form.id}/submissions`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        Submissions ({form.submission_count})
                      </Button>
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <CopyLinkButton formId={form.id} />
                    <DeleteFormButton formId={form.id} formName={form.name} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
