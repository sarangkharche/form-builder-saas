export type FieldType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'tel' | 'url';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
}

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  theme: 'light' | 'dark';
  buttonColor: string;
  notifyEmail?: string; // Pro feature
}

export interface Form {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  form_id: string;
  data: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  submitted_at: string;
}

export interface FormWithSubmissionCount extends Form {
  submission_count: number;
}
