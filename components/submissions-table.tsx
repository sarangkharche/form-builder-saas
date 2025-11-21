"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Submission, FormField } from "@/types/forms";

interface SubmissionsTableProps {
  submissions: Submission[];
  fields: FormField[];
}

export function SubmissionsTable({ submissions, fields }: SubmissionsTableProps) {
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || "");
  };

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {submission.id.slice(0, 8)}...
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.id}>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {field.label}
                    </p>
                    <p className="text-sm">
                      {formatValue(submission.data[field.id]) || (
                        <span className="text-muted-foreground italic">No answer</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
