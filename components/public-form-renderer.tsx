"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Form } from "@/types/forms";
import { submitForm } from "@/app/protected/forms/actions";
import { CheckCircle } from "lucide-react";

interface PublicFormRendererProps {
  form: Form;
}

export function PublicFormRenderer({ form }: PublicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: "" });
    }
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const current = formData[fieldId] || [];
    if (checked) {
      setFormData({ ...formData, [fieldId]: [...current, option] });
    } else {
      setFormData({ ...formData, [fieldId]: current.filter((o: string) => o !== option) });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    form.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
          newErrors[field.id] = `${field.label} is required`;
        }
      }

      // Email validation
      if (field.type === "email" && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email address";
        }
      }

      // URL validation
      if (field.type === "url" && formData[field.id]) {
        try {
          new URL(formData[field.id]);
        } catch {
          newErrors[field.id] = "Please enter a valid URL";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm(form.id, formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-center">Success!</h2>
          <p className="text-center text-muted-foreground max-w-md">
            {form.settings.successMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{form.name}</CardTitle>
        {form.description && (
          <CardDescription className="text-base">{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1.5"
                  rows={4}
                />
              ) : field.type === "select" ? (
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger className="mt-1.5" id={field.id}>
                    <SelectValue placeholder={field.placeholder || "Select an option..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "radio" ? (
                <div className="mt-2 space-y-2">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`${field.id}_${option}`}
                        name={field.id}
                        value={option}
                        checked={formData[field.id] === option}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="rounded-full"
                      />
                      <Label htmlFor={`${field.id}_${option}`} className="font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : field.type === "checkbox" ? (
                <div className="mt-2 space-y-2">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${field.id}_${option}`}
                        checked={(formData[field.id] || []).includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(field.id, option, e.target.checked)
                        }
                        className="rounded"
                      />
                      <Label htmlFor={`${field.id}_${option}`} className="font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1.5"
                />
              )}

              {errors[field.id] && (
                <p className="text-sm text-destructive mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            style={{ backgroundColor: form.settings.buttonColor }}
          >
            {isSubmitting ? "Submitting..." : form.settings.submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
