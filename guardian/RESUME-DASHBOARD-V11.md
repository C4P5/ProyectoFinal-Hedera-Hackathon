# Resume Dashboard V11

## PROMPT

```
Read guardian/DASHBOARD-HANDOFF-V11.md first.

Then read files ON DEMAND as needed (don't read everything upfront — saves context):
- dashboard/js/api.js — if touching Guardian POST/auth
- dashboard/js/dashboard.js — if touching delivery form, workflow orchestrator, stepper, count-up, hero metrics
- dashboard/js/config.js — if touching block IDs, proxy URL, config
- dashboard/js/hedera.js — if touching Hedera API calls, tx fetch, pagination
- dashboard/js/wallet.js — if touching wallet/CIT data, tx pagination, tx display
- dashboard/js/ui.js — if touching login/toast/loading
- dashboard/js/impact.js — if touching impact page data, colored bars, chart
- dashboard/js/marketplace.js — if touching marketplace stats
- dashboard/css/custom.css — if adding CSS animations, carousel
- dashboard/index.html — if touching delivery form HTML, hero, footer, carousel
- dashboard/wallet.html — if touching wallet/CIT layout, footer
- dashboard/marketplace.html — if touching marketplace layout, footer, contact mailto
- dashboard/impact.html — if touching impact page, footer
- proxy/src/index.js — if touching CORS proxy
- scripts/submit-failed-delivery.js — if touching failed delivery test script

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
- Hero metrics pull LIVE from Hedera Mirror Node (not Guardian blocks)
- Wallet tx history is paginated: 5/page with ◀▶ nav buttons
- Wallet tx now fetches with pagination (100/page, follows links.next)
- Tx direction: OWNER shows minus/sent, others show plus/received
- Delivery form ONLY visible to Project_Proponent role
- CTA card has right-scrolling carousel with platform benefits
- ENT numbering uses TOKENMINT event count from Mirror Node
- Impact page prefers live Guardian API over stale cache when logged in
- Impact chart bars colored by waste quality: A=green, B=yellow, C=red
- Marketplace: Contact Us → mailto, stats: 3 restaurants, 724kg composted
- V11 changes NOT YET committed

WHAT WAS DONE (V11 session):
- Count-up duration 1300→1100ms
- Delivery form PP-only (other roles see CTA card)
- Right-scrolling carousel on CTA card (5 info chips, CSS animation)
- ENT numbering fix (uses HederaMirror.getMintEvents() count)
- Wallet tx fetch: pagination + account-specific filter (correct direction)
- Impact page: live API preferred, colored bars by quality (A/B/C)
- Marketplace: Contact Us → mailto, stats 3 restaurants / 724kg
- Failed delivery script created (scripts/submit-failed-delivery.js)

IMMEDIATE NEXT STEPS:
1. Add marketplace images (user has images, not yet in repo — ask where)
2. Run failed delivery script: node scripts/submit-failed-delivery.js
3. Commit + push V11 changes
4. Visual QA on live site — carousel, form access, tx direction, colored bars
5. Mobile QA — carousel responsiveness, tx display

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
