import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { SubmissionsTable } from "@/components/submissions-table";
import { ExportCSVButton } from "@/components/export-csv-button";

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch form
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (formError || !form) {
    return notFound();
  }

  // Fetch submissions
  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select("*")
    .eq("form_id", id)
    .order("submitted_at", { ascending: false });

  if (submissionsError) {
    console.error("Error fetching submissions:", submissionsError);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/protected/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{form.name}</h1>
          <p className="text-muted-foreground mt-2">
            {submissions?.length || 0} total submissions
          </p>
        </div>
        {submissions && submissions.length > 0 && (
          <ExportCSVButton submissions={submissions} formName={form.name} fields={form.fields} />
        )}
      </div>

      {!submissions || submissions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">No submissions yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Submissions will appear here once people start filling out your form.
              </p>
              <Link href={`/f/${form.id}`} target="_blank">
                <Button variant="outline">View Form</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SubmissionsTable submissions={submissions} fields={form.fields} />
      )}
    </div>
  );
}
