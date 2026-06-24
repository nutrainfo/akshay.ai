# FinCalc Pro — Premium Indian Financial Tools

> **How to run locally:** `npm install && npm run serve` (frontend only) or `npm start` (with API server)

A production-ready premium financial tools website featuring 20+ calculators, live market data, mutual fund explorer, bank rate comparison and step-by-step ITR guide.

---

## Features

| Category | Details |
|---|---|
| **Calculators (20+)** | SIP, Step-up SIP, Lumpsum, SWP, SIP Goal, SIP Ladder, Home Loan EMI, Car Loan EMI, Education Loan, Prepayment, FD, RD, PPF, Old vs New Tax Regime, Income Tax, Capital Gains, NPS, Retirement Corpus, Child Education Planner, SIP vs Lumpsum |
| **Banks & Rates** | 18+ banks — FD rates (1Y/2Y/3Y/5Y/Senior), savings rates, loan rates. Filter, sort, compare |
| **Mutual Funds** | 24 direct funds — 1Y/3Y/5Y returns, AUM, risk tag, direct Groww deep links |
| **Live Markets** | NIFTY 50, SENSEX, GOLD (MCX), SILVER (MCX), USD/INR — auto-refreshing with sparkline charts |
| **ITR Guide** | Salaried / Business / Capital Gains — step-by-step with direct portal links |
| **Compare Engine** | SIP vs FD vs Lumpsum vs Gold vs NPS vs PPF — scenario-based with verdict |
| **Admin Panel** | `/admin` — update bank rates, import CSV, manage defaults |

---

## File Structure

```
akshay.ai/
├── index.html              # Main SPA — all pages/sections
├── style.css               # Mobile-first styles, glassmorphism, animations
├── app.js                  # All frontend logic, calculators, markets
├── package.json
├── .env.example            # Environment variable template
├── calculators/
│   └── formulas.js         # Pure financial formula library (no DOM deps)
├── data/
│   ├── bank-data.js        # Bank rates data
│   └── mf-data.js          # Mutual fund data
├── server/
│   └── server.js           # Express + WebSocket API server
├── admin/
│   └── index.html          # Admin panel (password-protected)
└── tests/
    └── calculator.test.js  # 20+ unit tests for all formula modules
```

---

## Quick Start

### Frontend Only (static — no server needed)
```bash
npm install
npm run serve
# Open http://localhost:8080
```

### With API Server (market data, WebSocket)
```bash
cp .env.example .env
# Edit .env with your API keys
npm install
npm start
# API on :3001, serve frontend separately
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3001
CMD ["node", "server/server.js"]
```
```bash
docker build -t fincalcpro . && docker run -p 3001:3001 --env-file .env fincalcpro
```

---

## Deploy — One-Click Options

### Vercel (Frontend + Serverless)
```bash
npm i -g vercel
vercel --prod
```
Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/server/server.js" }],
  "buildCommand": null,
  "outputDirectory": "."
}
```

### Netlify
```bash
# netlify.toml
[build]
  publish = "."
[[redirects]]
  from = "/api/*"
  to = "https://your-api-server.com/api/:splat"
  status = 200
```

### Railway / Render (Full-Stack with WebSocket)
1. Push to GitHub
2. Connect repo to Railway/Render
3. Set `PORT`, `ADMIN_KEY`, and market API keys as environment variables
4. Deploy — WebSocket relay works out of the box

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | API server port (default: 3001) | No |
| `ADMIN_KEY` | Admin panel access key | Yes (prod) |
| `ALLOWED_ORIGIN` | CORS frontend domain | Yes (prod) |
| `TRUEDATA_USER` / `TRUEDATA_PASS` | TrueData market API | Paid option |
| `RAPIDAPI_KEY` | RapidAPI IndianAPI key | Cheap option |
| `RESEND_API_KEY` | Email for contact form | Optional |

---

## Market Data Providers

### Paid / Low-Latency
- **TrueData** — https://truedata.in/api-documentation/ — WebSocket + REST, real-time NSE/BSE/MCX. ~₹500/mo.
- **GlobalDataFeeds** — https://globaldatafeeds.in/api — REST + WebSocket, good tick data.

### Affordable / Prototyping
- **RapidAPI / IndianAPI** — https://rapidapi.com/search/nse-stocks — REST, 15-min delayed, free tier available.
- **Apify** — https://apify.com/actors?search=nse — NSE/BSE scraper actors, pay-per-run.

Sample code to connect TrueData WebSocket:
```js
const ws = new WebSocket('wss://push.truedata.in/nsedata?token=YOUR_TOKEN');
ws.on('message', (data) => {
  const { symbol, LTP, change } = JSON.parse(data);
  broadcastMarket({ [symbol]: { ltp: LTP, change } });
});
```

---

## Running Tests

```bash
node tests/calculator.test.js
```

Tests cover: SIP, Step-up SIP, EMI, Amortization, Prepayment, FD (with TDS), RD, Capital Gains, Income Tax (Old & New regime), NPS, Retirement Corpus.

---

## CSV Schema for Bank Rates Import

```csv
name,y1,y2,y3,y5,senior
State Bank of India,6.8,7.0,7.0,6.5,7.3
HDFC Bank,7.1,7.2,7.0,7.0,7.6
```

Upload via Admin Panel → Bank Rates → Import CSV.

---

## Mutual Fund Groww Deep Links

Format: `https://groww.in/mutual-funds/{slug}`

Example: `https://groww.in/mutual-funds/sbi-bluechip-fund-direct-plan-growth`

To open in the Groww app (mobile intent): `groww://funds/{slug}` (Android intent; iOS uses universal links via `https://groww.in/...`).

---

## Security Notes

- API keys live **only on the server** (`server/server.js`). Frontend calls `/api/*` proxy endpoints.
- Admin panel uses a shared secret key (`ADMIN_KEY`). In production, replace with OAuth or JWT.
- All financial data is delayed 15 min or simulated. Never use for live trading.
- Input validation is applied client-side for UX and server-side for API endpoints.
- Rate limiter: 200 requests / 15 min per IP on all API routes.

---

## Accessibility Checklist

- [x] Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`)
- [x] ARIA roles and labels on all interactive elements
- [x] Keyboard navigation (Tab, Enter, Escape for modal)
- [x] Color contrast ≥ 4.5:1 (text on dark backgrounds)
- [x] `prefers-reduced-motion` CSS media query + JS toggle
- [x] Focus-visible outlines on all interactive elements
- [x] Screen reader-friendly table headers with `scope`
- [x] Live region (`aria-live`) for calculator results

## Performance Checklist

- [x] CSS animations use `transform` and `opacity` only (GPU-accelerated)
- [x] Canvas animations use `requestAnimationFrame`
- [x] Particle count capped to viewport width / 20
- [x] `IntersectionObserver` for lazy reveal animations
- [x] Market data interval cleared on page visibility change
- [x] Fonts loaded with `display=swap`
- [x] No jQuery or heavy libraries; vanilla JS throughout
- [x] Single CSS file, single JS file (tree-shakeable per section)

---

## 5-Step Test Plan

1. **Calculators** — Open SIP calculator, enter ₹5,000/mo at 12% for 15 years. Verify corpus ≈ ₹25 lakh. Export CSV and verify schedule downloads.

2. **Live Market Data** — Load the Markets section. Prices should auto-update every 8 seconds with sparklines. Toggle 1D/1W/1M range buttons.

3. **Mutual Fund Deep Link** — Click "Open in Groww" on any fund card. Verify it opens `https://groww.in/mutual-funds/{slug}` in a new tab.

4. **ITR Guide** — Navigate to ITR Guide → Salaried tab. Verify all 6 steps render and portal links (`eportal.incometax.gov.in`) open in new tabs.

5. **Legal Disclaimer** — Verify persistent disclaimer banner appears below hero, footer shows "Not financial advice", and the Legal section has all 4 cards (Disclaimer, Privacy, Terms, Cookie).

---

## Developer Notes — Scaling Live Data

- For >1,000 concurrent users: move WebSocket relay to a dedicated process (cluster mode or separate service).
- Use Redis pub/sub to broadcast market updates across Node processes.
- Consider Server-Sent Events (SSE) as a simpler WebSocket alternative for one-way market feeds.
- Cache market API responses for 5 seconds to avoid rate limits; share cache across WebSocket broadcasts.

---

*© 2024 FinCalc Pro. For educational and informational purposes only. Not financial advice.*
