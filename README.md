<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1maS1PYQB6-txyGLoQdLoLZb6Iq0428HE

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the development server:
   `npm run dev`

The deployed build on Vercel only needs the Supabase credentials that are already baked into `lib/supabaseClient.ts`, so there
is no need to configure any Gemini/API keys for GitHub → Vercel deployments.

## Remove a Supabase user by email

If you need to reuse an email address in Supabase Auth, you can delete the account and its dependent records with the SQL below. Replace `YOUR_EMAIL_HERE` with the address you want to remove.

```sql
-- Swap in the address you want to clear
with target as (
  select id
  from auth.users
  where email = 'YOUR_EMAIL_HERE'
)
delete from auth.refresh_tokens rt using target t where rt.user_id = t.id::text;
delete from auth.sessions s using target t where s.user_id = t.id;
delete from auth.identities i using target t where i.user_id = t.id;
delete from auth.mfa_factors f using target t where f.user_id = t.id;
delete from auth.users u using target t where u.id = t.id;
```

Run the statements inside a transaction (`begin; ... commit;`) if you prefer an all-or-nothing change, and remove any application rows linked to `auth.users.id` beforehand to avoid foreign-key errors.
