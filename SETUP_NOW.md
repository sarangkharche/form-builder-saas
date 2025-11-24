# ⚡ Quick Setup - Do This Now!

Your Supabase project is ready. Here's what to do:

## 1️⃣ Run Database Migration (2 minutes)

Go to Supabase SQL Editor:
👉 https://app.supabase.com/project/lfjgvesudjbdmchrulsm/sql/new

Copy and paste this entire SQL script:

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON public.forms(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions(submitted_at DESC);

-- Enable RLS
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forms
CREATE POLICY "Users can view own forms" ON public.forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own forms" ON public.forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forms" ON public.forms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forms" ON public.forms FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for submissions
CREATE POLICY "Form owners can view submissions" ON public.submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.forms WHERE forms.id = submissions.form_id AND forms.user_id = auth.uid())
);
CREATE POLICY "Anyone can submit to forms" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Form owners can delete submissions" ON public.submissions FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.forms WHERE forms.id = submissions.form_id AND forms.user_id = auth.uid())
);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON public.forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Click **"Run"** button at the bottom.

---

## 2️⃣ Get Your Supabase Keys (1 minute)

Go to API Settings:
👉 https://app.supabase.com/project/lfjgvesudjbdmchrulsm/settings/api

Copy these two values:
- **Project URL**: `https://lfjgvesudjbdmchrulsm.supabase.co`
- **anon public key**: (starts with `eyJ...`)

---

## 3️⃣ Add Environment Variables to Vercel (2 minutes)

Go to Vercel Environment Variables:
👉 https://vercel.com/sarangkharches-projects/nextjs-supabase-stripe-update/settings/environment-variables

Add these 3 variables:

### NEXT_PUBLIC_SUPABASE_URL
```
https://lfjgvesudjbdmchrulsm.supabase.co
```

### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
[Paste your anon key from step 2]
```

### NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY
```
[Get this from https://update.dev after creating account]
```

Make sure to select **"Production", "Preview", and "Development"** for all variables!

---

## 4️⃣ Configure Update.dev (3 minutes)

1. Go to: https://update.dev
2. Sign up / Sign in
3. Create a new product:
   - Name: "Pro Plan"
   - Price: £9/month (or $10/month)
4. Create an entitlement:
   - Name: `pro`
5. Link the product to the `pro` entitlement
6. Copy your publishable key and add it to Vercel (step 3)

---

## 5️⃣ Redeploy (30 seconds)

```bash
cd ~/Desktop/nextjs-supabase-stripe-update
vercel --prod
```

---

## ✅ You're Done!

Your Form Builder SaaS will be live at:
https://nextjs-supabase-stripe-update-fhl2d15ue-sarangkharches-projects.vercel.app

Test it:
1. Sign up for an account
2. Create your first form
3. Share the form link
4. Collect submissions!

---

## 🆘 Need Help?

- Supabase not working? Check the migration ran successfully in SQL Editor
- Update.dev issues? Make sure product and entitlement are linked
- Vercel errors? Check all 3 environment variables are set

Full docs: `DEPLOYMENT_COMPLETE.md`
