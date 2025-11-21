"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteForm } from "@/app/protected/forms/actions";
import { useRouter } from "next/navigation";

export function DeleteFormButton({ formId, formName }: { formId: string; formName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${formName}"? This will also delete all submissions.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteForm(formId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex-1"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
