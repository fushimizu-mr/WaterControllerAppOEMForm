# My UFI — Dealer Configuration Portal

A React + Vite web app for collecting dealer customization data for the My UFI app.

---

## Before You Deploy — Two Required Steps

### 1. Create a Formspree endpoint (free)

Formspree receives the form submissions and emails them to you.

1. Go to https://formspree.io and create a free account
2. Click **New Form**, name it "My UFI Dealer Config"
3. Copy the form endpoint — it looks like `https://formspree.io/f/xyzabcde`
4. Open `src/App.jsx` and replace line 7:
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```
   with your actual endpoint.

### 2. Update the submission email text (optional)

In `src/App.jsx`, search for the confirmation message on the success screen and update it with your company name and contact details.

---

## Deploy to Vercel

### Option A — GitHub (recommended, enables auto-deploy on push)

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/myufi-dealer-portal.git
   git push -u origin main
   ```
2. Go to https://vercel.com and sign in with GitHub
3. Click **Add New Project** and import the repo
4. Leave all settings as defaults — Vercel auto-detects Vite
5. Click **Deploy**

Your form is live at `https://myufi-dealer-portal.vercel.app` (or similar).

### Option B — Vercel CLI (fastest, no GitHub needed)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Done.

---

## Local Development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

---

## Project Structure

```
myufi-dealer-portal/
  index.html          # Entry HTML
  vite.config.js      # Vite config
  package.json
  src/
    main.jsx          # React root mount
    App.jsx           # All form sections and logic
```

## Sections

| # | Section | Description |
|---|---------|-------------|
| I | App Information | App Store / Play Store metadata, icon, screenshots |
| II | Filter Catalog | Dynamic product list with all filter parameters |
| III | Dealer Profile | Contact info, hours, logo |
| IV | Branding & Theme | Colors, legal URLs |
| V | Documentation | Manual/cutsheet links + general app resources |
