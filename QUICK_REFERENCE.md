# ⚡ Quick Reference Card

## 🔗 Important Links

**Live App**: https://nextjs-supabase-stripe-update-fhl2d15ue-sarangkharches-projects.vercel.app
**Vercel Dashboard**: https://vercel.com/sarangkharches-projects/nextjs-supabase-stripe-update
**Supabase**: https://app.supabase.com
**Update.dev**: https://update.dev
**Resend**: https://resend.com

---

## ⚙️ Environment Variables

Add these in Vercel → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_... (optional)
RESEND_FROM_EMAIL=noreply@yourdomain.com (optional)
```

---

## 🗄️ Database Migration

Run in Supabase SQL Editor:
```sql
-- File: supabase/migrations/001_create_forms_tables.sql
-- Copy and paste entire file into SQL Editor and run
```

---

## 💳 Update.dev Setup

1. Create product: "Pro Plan" - £9/month
2. Create entitlement: `pro`
3. Link them together

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/protected/forms/` | Forms dashboard |
| `app/f/[id]/` | Public forms |
| `components/form-builder.tsx` | Builder UI |
| `utils/entitlements.ts` | Tier limits |
| `supabase/migrations/` | Database |

---

## 🚀 Commands

```bash
# Local dev
npm run dev

# Build
npm run build

# Deploy
vercel --prod

# Logs
vercel logs
```

---

## 💰 Pricing

**Free**: 1 form, 50 submissions/month
**Pro**: £9/month - unlimited everything

---

## 📚 Documentation

1. `SUCCESS_SUMMARY.md` - Overview
2. `DEPLOYMENT_COMPLETE.md` - Setup guide
3. `QUICK_START.md` - 10-min start
4. `FORM_BUILDER_SETUP.md` - Full docs

---

## ✅ Setup Checklist

- [ ] Add Supabase credentials to Vercel
- [ ] Run database migration
- [ ] Configure Update.dev
- [ ] Add Update.dev key to Vercel
- [ ] Redeploy: `vercel --prod`
- [ ] Test form creation
- [ ] Test form submission
- [ ] Test CSV export
- [ ] (Optional) Add Resend for emails

---

**Next**: Open `DEPLOYMENT_COMPLETE.md` for full setup instructions!
