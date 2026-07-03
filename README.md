# RateWise

Salary • Billing Rate • Gross Margin Calculator. Enter any two values — the third is calculated instantly. Fully client-side: no backend, no database.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · GitHub Pages

## Project structure

```
ratewise/
├── index.html                  # Entry HTML (fonts, favicon, meta)
├── package.json
├── vite.config.ts              # base: './' so it works at any Pages URL
├── tailwind.config.js          # Palette + type tokens
├── postcss.config.js
├── tsconfig.json / tsconfig.node.json
├── .github/workflows/deploy.yml  # Auto-deploy to GitHub Pages on push
└── src/
    ├── main.tsx                # React bootstrap
    ├── App.tsx                 # State + smart last-edited logic
    ├── index.css               # Tailwind layers, focus styles
    ├── config.ts               # Currency symbol (default ₹), version, repo URL
    ├── lib/
    │   ├── calc.ts             # Formulas, validation, derived-field picker
    │   └── format.ts           # Currency/percent parsing & formatting
    └── components/
        ├── Header.tsx
        ├── InputField.tsx      # Shared input with "auto" badge + errors
        ├── ResultsCard.tsx     # Highlights the calculated value
        └── Footer.tsx
```

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

**Option A — GitHub Actions (recommended, zero-config):**

1. Create a repository and push this code to the `main` branch.
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. Every push to `main` builds and deploys automatically via `.github/workflows/deploy.yml`.

**Option B — gh-pages branch:**

```bash
npm run deploy
```

Then set **Settings → Pages → Source** to the `gh-pages` branch.

## Configuration

- **Currency symbol** — edit `CURRENCY_SYMBOL` in `src/config.ts` (default `₹`).
- **Footer GitHub link** — edit `GITHUB_URL` in `src/config.ts`.

## Formulas

```
GM     = 1 − ((Annual Salary ÷ 12) ÷ Monthly Billing Rate)
Rate   = (Annual Salary ÷ 12) ÷ (1 − GM)
Salary = 12 × Monthly Billing Rate × (1 − GM)
Markup = (Rate − Monthly Salary) ÷ Monthly Salary
```
