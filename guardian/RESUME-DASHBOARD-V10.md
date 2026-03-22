# Resume Dashboard — V10

## PROMPT

```
Read guardian/DASHBOARD-HANDOFF-V10.md first.

Then read files ON DEMAND as needed (don't read everything upfront — saves context):
- dashboard/js/api.js — if touching Guardian POST/auth
- dashboard/js/dashboard.js — if touching delivery form, workflow orchestrator, stepper, count-up, hero metrics
- dashboard/js/config.js — if touching block IDs, proxy URL, config
- dashboard/js/hedera.js — if touching Hedera API calls
- dashboard/js/wallet.js — if touching wallet/CIT data, tx pagination
- dashboard/js/ui.js — if touching login/toast/loading
- dashboard/js/impact.js — if touching impact page data
- dashboard/css/custom.css — if adding CSS animations
- dashboard/index.html — if touching delivery form HTML, hero, footer
- dashboard/wallet.html — if touching wallet/CIT layout, footer
- dashboard/marketplace.html — if touching marketplace layout, footer
- dashboard/impact.html — if touching impact page, footer
- proxy/src/index.js — if touching CORS proxy

CONTEXT:
- Eggologic circular economy platform on Hedera for Apex Hackathon (deadline March 22, 2026)
- Dashboard DEPLOYED at https://c4p5.github.io/EggoLogic-Hedera-Hackathon/
- CORS proxy LIVE at https://eggologic-proxy.sargas.workers.dev
- Architecture: static HTML + JS fetch + Tailwind CDN, no build tools
- GitHub Pages deploys on push to main (~20s)
- Guardian login now works with REAL tokens (no more offline fallback)
- Auto-workflow: PP submit → VVB auto-approve → EGGOCOIN mint (all automated)
- Token display uses "$EGGO" not "EGO"
- Password for all demo accounts: "test"
- CDM AMS-III.F methodology: kg_ajustados = (kg_bruto - kg_impropios) × 0.70
- EGGOCOIN supply: 1,215 (1,205 PP + 10 OWNER)
- CIT Token: 0.0.8287362 (NFT), 4 minted, 1 valid (serial #4)
- Hero metrics now pull LIVE from Hedera Mirror Node (not Guardian blocks)
- Wallet tx history is paginated: 5/page with ◀▶ nav buttons

WHAT WAS DONE (V10 session):
- Footer "Powered by" redesigned: centered section, not 4th grid column
- Guardian SVG replaced (broken 38K wordmark → clean shield icon)
- All SVGs h-6→h-8 (33% bigger, matching sizes)
- Count-up duration 1400→1300ms
- Hero metrics connected to Hedera testnet via Mirror Node
- Wallet tx history paginated (5/page, ◀▶ arrow nav)
- V10 changes committed and pushed (c44a252)

IMMEDIATE NEXT STEPS:
1. Visual QA on live site — verify all V10 changes render correctly
2. Mobile QA — footer responsive, tx nav buttons
3. Test auto-approve flow from live site if not yet tested today

TASK:
[describe what you want to do next]

Key constraints:
- Hackathon deadline is March 22, 2026
- No build tools — static HTML + JS fetch + Tailwind CDN
- Auto-deploys on push to main via GitHub Actions
- Local server: cd dashboard && npx http-server . -p 8080 -c-1 --cors
- Proxy redeploy: cd proxy && wrangler deploy
- Windows 10, no python, use node for scripting
- READ FILES ON DEMAND to save context window
```
