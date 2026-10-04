# Free Invitation Builder — V1

A small Netlify app that lets a customer fill a form, upload photos, choose a template + theme, preview the invitation, and create a shareable `/i/<slug>` URL.

## What is included

- Customer form — no HTML editing for the customer
- Live preview
- 3 layouts: Classic, Minimal, Luxury
- 5 themes: Royal Gold, Rose Romance, Emerald, Midnight, Ivory
- Wedding, Engagement, Birthday, Anniversary, Baby Shower, Naming Ceremony, Housewarming labels
- Up to 3 event cards
- Main photo + up to 4 gallery photos
- Countdown, events, gallery, wishes toggles
- Netlify Function to create invitation data
- Netlify Blob storage for invitation records
- Shareable invitation URLs

## Important V1 note

The browser resizes photos before submission and the invitation record stores the optimized images inside the JSON blob. This is deliberately simple for the first free prototype. A later V2 can move images into separate Blob objects for better scale.

## Step 1 — Install Node.js

Use Node.js 18.14 or newer.

Check:

```bash
node -v
npm -v
```

## Step 2 — Open this folder

```bash
cd invitation-builder
```

## Step 3 — Install dependencies

```bash
npm install
```

## Step 4 — Install Netlify CLI

```bash
npm install -g netlify-cli
```

## Step 5 — Sign in

```bash
netlify login
```

A browser window will open. Sign in to Netlify.

## Step 6 — Create/link your Netlify project

From this folder:

```bash
netlify init
```

Choose the option to create a new Netlify project when prompted.

## Step 7 — Run locally

```bash
netlify dev
```

Open the URL printed by Netlify, normally:

```text
http://localhost:8888
```

Do NOT open `index.html` directly with `file://` because the Netlify Functions need the Netlify Dev server.

## Step 8 — Test

1. Enter names.
2. Pick a date/time.
3. Upload a main photo.
4. Upload a few gallery photos.
5. Pick a template.
6. Pick a theme.
7. Click **Create Invitation**.
8. Open the generated `/i/...` link.

## Step 9 — Deploy live

```bash
netlify deploy --prod
```

Netlify will give you the live project URL.

## Step 10 — Customer workflow

Give customers the main builder URL:

```text
https://YOUR-SITE.netlify.app
```

They fill the form and get a link such as:

```text
https://YOUR-SITE.netlify.app/i/rahul-priya-a1b2c3
```

## Free-plan note

Netlify currently lists a $0/month Free plan with a 300-credit monthly hard limit. When the limit is reached, projects pause rather than automatically charging the Free plan. Check Netlify's pricing page before launching at scale.

## Next upgrade after V1

- Admin dashboard
- Edit existing invitation
- Better photo storage
- More templates
- Custom logo/branding
- QR code sharing
- Custom domains
- Customer login/payment flow
