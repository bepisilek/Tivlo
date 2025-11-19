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
