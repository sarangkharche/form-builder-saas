"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import type { FormField, FieldType, Form } from "@/types/forms";
import { createForm, updateForm } from "@/app/protected/forms/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormBuilderProps {
  mode: "create" | "edit";
  initialData?: Form;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "url", label: "URL" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkboxes" },
];

export function FormBuilder({ mode, initialData }: FormBuilderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formName, setFormName] = useState(initialData?.name || "");
  const [formDescription, setFormDescription] = useState(initialData?.description || "");
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || []);
  const [submitButtonText, setSubmitButtonText] = useState(
    initialData?.settings.submitButtonText || "Submit"
  );
  const [successMessage, setSuccessMessage] = useState(
    initialData?.settings.successMessage || "Thank you for your submission!"
  );

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "New Field",
      placeholder: "",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field");
      return;
    }

    setIsSaving(true);
    try {
      const formData = {
        name: formName,
        description: formDescription,
        fields,
        settings: {
          submitButtonText,
          successMessage,
          theme: "light" as const,
          buttonColor: "#000000",
        },
      };

      if (mode === "create") {
        await createForm(formData);
        router.push("/protected/forms");
      } else if (initialData) {
        await updateForm(initialData.id, formData);
        router.push("/protected/forms");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form Builder */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="formName">Form Name *</Label>
              <Input
                id="formName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contact Form"
              />
            </div>
            <div>
              <Label htmlFor="formDescription">Description</Label>
              <Textarea
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description for your form"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Form Fields</CardTitle>
              <Button onClick={addField} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No fields yet. Click "Add Field" to get started.
              </div>
            ) : (
              fields.map((field, index) => (
                <Card key={field.id} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Field {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div>
                      <Label>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value: FieldType) =>
                          updateField(index, { type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Label *</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        placeholder="Your Name"
                      />
                    </div>

                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        value={field.placeholder || ""}
                        onChange={(e) =>
                          updateField(index, { placeholder: e.target.value })
                        }
                        placeholder="Enter your name..."
                      />
                    </div>

                    {(field.type === "select" ||
                      field.type === "radio" ||
                      field.type === "checkbox") && (
                      <div>
                        <Label>Options (one per line)</Label>
                        <Textarea
                          value={field.options?.join("\n") || ""}
                          onChange={(e) =>
                            updateField(index, {
                              options: e.target.value
                                .split("\n")
                                .filter((o) => o.trim()),
                            })
                          }
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={4}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required_${field.id}`}
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, { required: e.target.checked })
                        }
                        className="rounded"
                      />
                      <Label htmlFor={`required_${field.id}`}>Required field</Label>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="submitButtonText">Submit Button Text</Label>
              <Input
                id="submitButtonText"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                placeholder="Submit"
              />
            </div>
            <div>
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder="Thank you for your submission!"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : mode === "create" ? "Create Form" : "Update Form"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-4 h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
              <div>
                <h2 className="text-2xl font-bold">{formName || "Form Name"}</h2>
                {formDescription && (
                  <p className="text-muted-foreground mt-2">{formDescription}</p>
                )}
              </div>

              {fields.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Add fields to see preview
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <Label>
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          disabled
                          className="mt-1.5"
                        />
                      ) : field.type === "select" ? (
                        <Select disabled>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder={field.placeholder || "Select..."} />
                          </SelectTrigger>
                        </Select>
                      ) : field.type === "radio" || field.type === "checkbox" ? (
                        <div className="mt-2 space-y-2">
                          {(field.options || ["Option 1", "Option 2"]).map(
                            (option, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type={field.type}
                                  disabled
                                  className="rounded"
                                />
                                <span className="text-sm">{option}</span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled
                          className="mt-1.5"
                        />
                      )}
                    </div>
                  ))}
                  <Button className="w-full" disabled>
                    {submitButtonText}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
