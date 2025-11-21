import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { PublicFormRenderer } from "@/components/public-form-renderer";

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: form, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !form) {
    return notFound();
  }

  if (!form.is_active) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Form Unavailable</h1>
          <p className="text-muted-foreground">
            This form is not currently accepting submissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="max-w-2xl w-full">
        <PublicFormRenderer form={form} />
      </div>
    </div>
  );
}
