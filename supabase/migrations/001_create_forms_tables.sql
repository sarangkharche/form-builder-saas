-- Create forms table
CREATE TABLE IF NOT EXISTS public.forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    settings JSONB NOT NULL DEFAULT '{
        "submitButtonText": "Submit",
        "successMessage": "Thank you for your submission!",
        "theme": "light",
        "buttonColor": "#000000"
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON public.forms(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forms table

-- Users can view their own forms
CREATE POLICY "Users can view own forms"
    ON public.forms FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own forms
CREATE POLICY "Users can insert own forms"
    ON public.forms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own forms
CREATE POLICY "Users can update own forms"
    ON public.forms FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own forms
CREATE POLICY "Users can delete own forms"
    ON public.forms FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for submissions table

-- Form owners can view submissions for their forms
CREATE POLICY "Form owners can view submissions"
    ON public.submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.forms
            WHERE forms.id = submissions.form_id
            AND forms.user_id = auth.uid()
        )
    );

-- Anyone can insert submissions (public form submissions)
CREATE POLICY "Anyone can submit to forms"
    ON public.submissions FOR INSERT
    WITH CHECK (true);

-- Form owners can delete submissions for their forms
CREATE POLICY "Form owners can delete submissions"
    ON public.submissions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.forms
            WHERE forms.id = submissions.form_id
            AND forms.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for forms table
CREATE TRIGGER update_forms_updated_at
    BEFORE UPDATE ON public.forms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
