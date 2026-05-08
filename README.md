# MIS Studio

A self-hosted, three-app back office for the studio: **TRACKR** (time, projects, performance), **PAY** (payroll, vendor invoices, Xero), and **GROW** (sales pipeline). All three are static HTML files that share a Supabase backend and a Google-authenticated login.

## What's in this repo

```
.
├── index.html        # Lands on TRACKR
├── trackr.html       # Time tracking, projects, performance, projections
├── pay.html          # Payroll, staff, vendor invoices, Xero
├── grow.html         # Sales pipeline (CRM)
├── mis-studio.css    # Shared design tokens
└── README.md
```

No build step. Open `index.html` locally and it works. Deploy by pushing this repo to a static host.

## Deployment — `method.mis.studio`

### 1. Push to Git

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<org>/<repo>.git
git push -u origin main
```

### 2. Connect to a static host

Any of Cloudflare Pages, Vercel, or Netlify will auto-deploy on push to `main`. No build command needed — set the **output directory to the repo root**.

| Host              | Setup                                                      |
| ----------------- | ---------------------------------------------------------- |
| Cloudflare Pages  | Connect repo → Framework: *None* → Build output: `/`       |
| Vercel            | Import repo → Framework: *Other* → Output dir: `./`        |
| Netlify           | Connect repo → Build command: *(blank)* → Publish dir: `.` |

### 3. Point the subdomain

Add a `CNAME` record on `method.mis.studio` pointing to the host (e.g. `<project>.pages.dev`). TLS provisions automatically.

### 4. Configure Google Auth

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth 2.0 Client ID (type: Web application).
2. Authorised JavaScript origins: `https://method.mis.studio`.
3. In TRACKR → **Account → Google Sign-In**, paste the Client ID and set the allowed Workspace domain.

### 5. Connect Supabase

One admin connects once via PAY → Settings → Supabase. The URL and anon key sync to every team member's browser on first load. Verify the anon key only has access to the `mis_workspaces` table (RLS).

### 6. Seed and onboard

- Export your current local data: TRACKR → Settings → Data → **Export Full Backup** (bundles all three apps).
- On the deployed site, sign in as admin, then **Import** the bundle.
- Assign roles (Admin / Team Manager / Member) under Settings → Roles & Access.
- Walk the team through their first Google sign-in.

## Operational rhythm

- **Daily / weekly** — team logs hours in TRACKR (My Hours).
- **Weekly** — managers review utilisation in TRACKR → Performance.
- **Monthly** — admin locks payroll in PAY, reviews projections in TRACKR.
- **Monthly** — admin downloads the full JSON backup as offsite disaster recovery (Supabase is the live store; the JSON is the belt-and-braces).

## Updating

Edit any file → commit → push. The host redeploys in under a minute. Use branches and pull requests for anything substantial; rollbacks are one click on the host.

## Stack

- Static HTML, vanilla JS, no build pipeline
- Supabase (Postgres) for shared state and real-time sync
- Google OAuth for sign-in (domain-restricted)
- Xero (PAY only) for transaction sync
- EmailJS for scheduled performance reports and reminders
- ExchangeRate-API for FX
