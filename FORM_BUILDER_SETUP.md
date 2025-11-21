# Form Builder SaaS - Setup Guide

This template has been transformed into a **Form Builder SaaS** application where users can create custom forms, collect submissions, and manage their data.

## 🎯 What This App Does

A simple yet powerful form builder for small businesses that allows users to:
- Create unlimited custom forms (Pro plan) or 1 form (Free plan)
- Add various field types: text, email, phone, textarea, dropdowns, radio buttons, checkboxes
- Collect form submissions with automatic validation
- View and manage submissions in a dashboard
- Export submissions to CSV
- Get email notifications for new submissions (Pro plan)
- Share forms via public links or embed codes

## 💰 Monetization Model

### Free Plan
- 1 form
- 50 submissions per month
- All field types
- CSV export
- No email notifications

### Pro Plan (£9/month)
- Unlimited forms
- Unlimited submissions
- All field types
- CSV export
- Email notifications for new submissions

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An Update.dev account
- (Optional) A Resend account for email notifications

### 2. Environment Variables

Create a `.env.local` file with the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Update.dev
NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY=your_update_publishable_key

# Resend (Optional - for email notifications)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Database Setup

Run the Supabase migration to create the necessary tables:

```bash
# Navigate to your Supabase project dashboard
# Go to SQL Editor and run the contents of:
supabase/migrations/001_create_forms_tables.sql
```

This creates:
- `forms` table - stores form definitions
- `submissions` table - stores form submissions
- Row Level Security (RLS) policies for data access control

### 4. Update.dev Setup

1. Log in to your [Update.dev dashboard](https://update.dev)
2. Create a new product called "Pro Plan"
3. Set the price to £9/month
4. Create an entitlement named `pro`
5. Link the "Pro Plan" product to the `pro` entitlement

### 5. Install Dependencies

```bash
npm install
```

If you want email notifications, install Resend:

```bash
npm install resend
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your form builder!

## 📁 Project Structure

```
app/
├── protected/
│   ├── forms/                 # Forms management
│   │   ├── page.tsx          # Forms dashboard
│   │   ├── new/              # Create new form
│   │   ├── [id]/
│   │   │   ├── edit/         # Edit form
│   │   │   └── submissions/  # View submissions
│   │   └── actions.ts        # Server actions
│   ├── pricing/              # Pricing page
│   └── subscription/         # Subscription management
├── f/[id]/                   # Public form pages
└── page.tsx                  # Landing page

components/
├── form-builder.tsx          # Form builder UI
├── public-form-renderer.tsx  # Public form display
├── submissions-table.tsx     # Submissions dashboard
├── usage-banner.tsx          # Usage limits display
└── export-csv-button.tsx     # CSV export

utils/
├── entitlements.ts           # Subscription checks
└── email.ts                  # Email notifications

types/
└── forms.ts                  # TypeScript types
```

## 🎨 Customization

### Changing Plan Limits

Edit `/utils/entitlements.ts`:

```typescript
// Free tier limits
return {
  maxForms: 1,                    // Change number of forms
  maxSubmissionsPerMonth: 50,     // Change submission limit
  hasEmailNotifications: false,
  hasUnlimitedForms: false,
  hasUnlimitedSubmissions: false,
};
```

### Changing Pricing

1. Update Update.dev dashboard with new prices
2. Update `/app/protected/pricing/page.tsx` to reflect new pricing

### Adding Field Types

Edit `/types/forms.ts` and add to the `FieldType` union:

```typescript
export type FieldType = 'text' | 'email' | 'yourNewType';
```

Then update `/components/form-builder.tsx` to add the field to the UI.

## 🔐 Security

- All forms are protected by Row Level Security (RLS)
- Only form owners can view/edit their forms
- Public form pages only allow submissions (no data leakage)
- Email validation and URL validation built-in
- Rate limiting recommended for production (add via middleware)

## 📧 Email Notifications

Email notifications are sent via Resend when:
- User has Pro subscription
- User has configured `notifyEmail` in form settings
- A new submission is received

To enable:
1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=forms@yourdomain.com
   ```
4. Verify your domain in Resend dashboard

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Works on any platform that supports Next.js 15:
- Netlify
- Railway
- Render
- Self-hosted with Docker

## 📈 Marketing Ideas

To reach £10/day (£300/month) revenue:

### Target Audience
- Small business owners
- Freelancers
- Coaches and consultants
- Local service providers
- Solopreneurs

### Marketing Channels
1. **Product Hunt** - Launch and get initial traction
2. **Twitter/X** - Share form building tips, tweet about simplicity
3. **Reddit** - r/entrepreneur, r/smallbusiness (provide value, don't spam)
4. **SEO** - Blog about "simple form builder", "typeform alternative"
5. **Facebook Groups** - Join small business groups
6. **Direct Outreach** - Email local businesses offering free setup

### Content Ideas
- "5 Forms Every Small Business Needs"
- "How to Collect Leads Without Complicated Tools"
- "Typeform vs Google Forms vs [Your App]"
- Free form templates

### Pricing Strategy
- Keep free tier generous to get users hooked
- £9/month is impulse-buy territory (no approval needed)
- Consider annual plan at £90/year (2 months free)

## 🐛 Troubleshooting

### Forms not showing up
- Check RLS policies in Supabase
- Verify user is authenticated
- Check browser console for errors

### Submissions not saving
- Verify form is active (`is_active = true`)
- Check Supabase logs for errors
- Ensure public form URL is correct

### Email notifications not working
- Verify Resend API key is correct
- Check Resend dashboard for errors
- Ensure user has Pro subscription
- Confirm `notifyEmail` is set in form settings

### Entitlement checks failing
- Verify Update.dev integration is correct
- Check Update dashboard for subscription status
- Ensure `pro` entitlement exists

## 📝 Next Steps

### MVP Enhancements
- [ ] Add form analytics (views, conversion rate)
- [ ] Form themes and styling options
- [ ] File upload field type
- [ ] Webhook integrations
- [ ] Zapier integration
- [ ] Custom thank you pages
- [ ] Form logic (conditional fields)
- [ ] Anti-spam protection (reCAPTCHA)

### Growth Features
- [ ] Form templates library
- [ ] White-label options (Enterprise plan)
- [ ] Team collaboration
- [ ] API access
- [ ] Custom domains for forms

## 💡 Tips for Success

1. **Ship Fast** - Get the MVP live in 2 weeks
2. **Talk to Users** - Get 10 people to try it before launch
3. **Double Down** - Once you find a channel that works, focus there
4. **Pricing** - Don't be afraid to charge - £9 is very reasonable
5. **Support** - Reply to every question within 24 hours
6. **Iterate** - Add features based on user requests, not assumptions

## 📞 Support

If you need help:
- Check the [Update.dev docs](https://update.dev/docs)
- Check the [Supabase docs](https://supabase.com/docs)
- Open an issue in the repository

Good luck building your form builder SaaS! 🚀
