# Dashboard Build — Handoff V11

## Status: V11 FEATURES — Form access, carousel, tx fixes, impact colors, marketplace polish

**Date:** 2026-03-21
**Deadline:** 2026-03-22 (Hedera Apex Hackathon)
**Previous handoffs:** V10 (footer/SVG/testnet metrics/tx pagination), V9 (count-up/footer logos/pulse glow), V8 (CORS proxy/auto-workflow), V7 (CIT card/delivery form), V6 (polish/wallet redesign), V5 (HashScan/login gate/NFT), V4 (mobile/deploy), V3 (CORS fix), V2 (scaffold), V1 (brainstorm)

---

## WHAT WAS ACCOMPLISHED THIS SESSION

### 1. Count-Up Speed (index.html)

Default duration changed from `1300ms` → `1100ms` in `countUp()` function.

### 2. Delivery Form Access Control (index.html)

The waste delivery form was visible to ALL logged-in users. Now only **Project_Proponent** sees the form. All other users (logged in or not) see the "Sign in to Submit" CTA card.

- `updateDeliveryCard()` checks `user.role === 'Project_Proponent'`
- Other roles (OWNER, Registry, Operator, VVB) see the CTA card with the carousel

### 3. Right-Scrolling Carousel (index.html)

Added an auto-scrolling horizontal carousel to the CTA card with 5 info chips:
- "1 kg = 1 $EGGO" / "On-Chain Proof" / "Auto-Verified" / "Earn Rewards" / "Impact NFTs"
- Duplicated set for seamless infinite loop
- CSS `@keyframes scrollRight` animation (18s linear infinite)
- Pauses on hover
- Stretches full width of CTA card with negative margin bleed

### 4. ENT Numbering Fix (index.html)

ENT delivery IDs were stuck at #11 because the count came from stale Guardian cache. Now:
- New `_updateDeliveryId()` function fetches count from `HederaMirror.getMintEvents()`
- Each TOKENMINT event = one approved delivery, so count auto-increments correctly
- Falls back to `window._deliveryCount` (from `loadGlobalMetrics`) if Mirror Node fails

### 5. Transaction Fetch Fix (wallet.html)

Wallet tx history was showing only 9 of many transactions because `getTransactions()`:
- Only fetched 25 mixed transactions (HBAR + EGGOCOIN), then filtered for EGGOCOIN
- Now fetches up to 100 per page with pagination support (`links.next`)
- Default target count increased to 50

### 6. Transaction Direction Fix (wallet.html + index.html)

Non-owner accounts showed minus sign / "EGGOCOIN Sent" for received tokens because the code found the first EGGOCOIN transfer entry (treasury debit) instead of the account-specific one.

- `getTransactions()` now filters by `t.account === accountId`
- **OWNER (treasury):** debit side → shows `-` / "EGGOCOIN Sent" ✓
- **PP/others:** credit side → shows `+` / "EGGOCOIN Received" ✓
- Fix applies to both wallet.html full history AND index.html wallet widget

### 7. Dynamic Impact Data (impact.html)

`api.js getBlockData()` was always using stale cache even when logged in. Now:
- Prefers live Guardian API when user is logged in (not offline)
- Falls back to cache only if live API fails
- Impact graph and delivery cards now show fresh data after new mints

### 8. Colored Chart Bars by Waste Quality (impact.html)

Bars in the organic waste chart now colored by CDM category:
- **Cat. A** (≤5% contamination): green (`bg-primary`)
- **Cat. B** (5-10%): yellow (`bg-[#FBD54E]`)
- **Cat. C** (>10% / rejected): red (`bg-red-400/70`)
- Category extracted from Guardian field `field13` (or `categoria`)
- Tooltip shows category label: "ENT-005: 55kg Cat.B ✓"
- Fallback data updated with categories and ENT-011 added

### 9. Failed Delivery Test Script (impact.html)

Created `scripts/submit-failed-delivery.js` — Node script that:
1. Logs in as PP, submits a Cat C delivery (20% contamination)
2. Waits 5s for Guardian indexing
3. Logs in as VVB, finds the delivery, rejects it (`Button_1`)
4. Result: red bar in impact graph, percentage updates

Run: `node scripts/submit-failed-delivery.js`

### 10. Marketplace — Contact Us Mailto

"Contact us" button in Zero-Waste Certification card changed from `UI.showToast('Coming soon')` to `mailto:Eggologic-Registry@outlook.com` (opens email client in new window).

### 11. Marketplace — Stats Fixed

- **Restaurants Joined:** was dynamic (calculated as `totalSupply × 8.9` → showed ~11.4k) → now static **3**
- **Kilograms Composted:** was static 450 → now **724**

---

## FILE CHANGES (this session)

| File | Change |
|------|--------|
| `dashboard/js/dashboard.js` | countUp 1300→1100ms; PP-only form access; ENT ID from mint events |
| `dashboard/js/hedera.js` | getTransactions: account-specific filter + pagination (100/page, follows links.next) |
| `dashboard/js/api.js` | getBlockData prefers live API when logged in, cache as fallback |
| `dashboard/js/impact.js` | Category extraction + colored bars (A/B/C); fallback data updated with categories + ENT-011 |
| `dashboard/js/marketplace.js` | Stats: stat-h2o=3, stat-reforested=724 (both static) |
| `dashboard/index.html` | Right-scrolling carousel in CTA card |
| `dashboard/marketplace.html` | Contact us → mailto:Eggologic-Registry@outlook.com |
| `dashboard/css/custom.css` | carousel-scroll animation (@keyframes scrollRight 18s) |
| `scripts/submit-failed-delivery.js` | NEW — Node script to submit + reject a Cat C delivery |

---

## CURRENT STATE

| Component | Status |
|-----------|--------|
| CORS Proxy | LIVE at `eggologic-proxy.sargas.workers.dev` |
| Guardian Login | WORKING (real tokens via proxy) |
| PP Delivery Submit | WORKING — PP-only access (other roles see CTA) |
| VVB Auto-Approve | WORKING (tested ENT-011 → minted 15 $EGGO) |
| HashScan Deep Links | DONE on all pages |
| Count-Up Animation | DONE — 1.1s ease-out |
| Hero Metrics | LIVE from Hedera testnet Mirror Node |
| Footer Logo Strip | DONE — centered, consistent SVGs, all 4 pages |
| Pulse Glow | DONE on index.html hero dot |
| Wallet TX Pagination | DONE — 5/page with ◀▶ nav |
| Wallet TX Fetch | FIXED — pagination + correct direction indicators |
| CTA Carousel | DONE — right-scrolling auto-loop, 5 chips |
| ENT Numbering | FIXED — uses TOKENMINT event count from Mirror Node |
| Impact Dynamic Data | FIXED — live API preferred when logged in |
| Impact Bar Colors | DONE — A=green, B=yellow, C=red |
| Marketplace Stats | FIXED — 3 restaurants, 724 kg composted |
| Marketplace Contact | DONE — mailto link |
| EGGOCOIN Supply | 1,215 total (1,205 PP + 10 OWNER) |
| CIT NFTs | 4 minted (serial #4 valid) |

---

## REMAINING WORK

### Critical (before hackathon):
- **Marketplace images** — user has images to add (not yet in repo), wire into cards
- **Run failed delivery script** — `node scripts/submit-failed-delivery.js` to test impact graph red bar
- **Visual QA on live site** — verify carousel, form access, tx direction, colored bars
- **Mobile QA** — carousel responsiveness, tx direction on mobile
- **Commit + push V11 changes** — not yet committed

### Nice-to-have (if time):
- Fix HTML bugs (nested `<nav>` in impact.html:60)
- "Connected to Guardian API" toast on login (vs "Offline mode" yellow)
- Architecture diagram on README for judges
- Hamburger menu for mobile (if not already done)

---

## ACCOUNTS (unchanged)

| Role | Email | Hedera Account | EGGOCOIN |
|------|-------|----------------|----------|
| OWNER (SR) | r.aguileira88@gmail.com | 0.0.7166777 | 10 |
| Registry | eggologic-registry@outlook.com | 0.0.8292724 | 0 |
| Project_Proponent | eggologic-proponent@outlook.com | 0.0.8294621 | 1,205 |
| Operator | eggologic-operator@outlook.com | 0.0.8294659 | 0 |
| VVB | eggologic-vvb@outlook.com | 0.0.8294709 | 0 |

**Password for all:** `test`

---

## KEY BLOCK IDS (unchanged)

| Block | ID | Used For |
|-------|----|----------|
| PP Delivery Form | `b322eaa1-7611-4704-be60-b033db83dadb` | PP submits waste delivery |
| VVB Delivery Source | `3a5afd50-d4a5-49ca-866b-75477790ae4c` | Fetch pending deliveries as VVB |
| VVB Delivery Approve | `337cef47-e484-48bb-9249-a952cb72f203` | Approve/reject delivery as VVB |

---

## HOW TO RUN / DEPLOY

```bash
# Local dev
cd dashboard && npx http-server . -p 8080 -c-1 --cors

# Deploy dashboard (auto on push to main)
git push origin main

# Redeploy proxy (if changed)
cd proxy && wrangler deploy

# Submit a failed delivery for testing
node scripts/submit-failed-delivery.js
```

---

## RESUME PROMPT

See `guardian/RESUME-DASHBOARD-V11.md`

---

## REFERENCED FILES

| File | Purpose |
|------|---------|
| `guardian/DASHBOARD-HANDOFF-V10.md` | Previous session (footer/SVG/testnet metrics/tx pagination) |
| `scripts/submit-failed-delivery.js` | Submit + reject Cat C delivery for impact graph testing |
| `docs/carbon-methodology.md` | CDM AMS-III.F methodology |
