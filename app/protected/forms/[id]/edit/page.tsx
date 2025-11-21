import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { FormBuilder } from "@/components/form-builder";

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: form, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !form) {
    return notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Form</h1>
        <p className="text-muted-foreground mt-2">
          Make changes to your form
        </p>
      </div>

      <FormBuilder mode="edit" initialData={form} />
    </div>
  );
}
