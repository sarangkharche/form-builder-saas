"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Submission, FormField } from "@/types/forms";

interface ExportCSVButtonProps {
  submissions: Submission[];
  formName: string;
  fields: FormField[];
}

export function ExportCSVButton({ submissions, formName, fields }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    // Create CSV headers
    const headers = [
      "Submission ID",
      "Submitted At",
      ...fields.map((field) => field.label),
    ];

    // Create CSV rows
    const rows = submissions.map((submission) => {
      const formatValue = (value: any): string => {
        if (Array.isArray(value)) {
          return `"${value.join(", ")}"`;
        }
        if (typeof value === "object" && value !== null) {
          return `"${JSON.stringify(value)}"`;
        }
        const str = String(value || "");
        // Escape quotes and wrap in quotes if contains comma or newline
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return [
        submission.id,
        new Date(submission.submitted_at).toISOString(),
        ...fields.map((field) => formatValue(submission.data[field.id])),
      ];
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${formName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_submissions_${Date.now()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={exportToCSV} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Export to CSV
    </Button>
  );
}
