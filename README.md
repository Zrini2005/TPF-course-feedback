<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1g4VwC6LH0EEASRrztsgM8iOChUIgQCwq

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repository is configured for automatic deployment to GitHub Pages.

### Setup Instructions

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to the `main` branch or manually trigger the workflow
4. Your app will be available at: `https://<your-username>.github.io/TPF-course-feedback/`

The deployment workflow will automatically build and deploy your app whenever you push to the `main` branch.
