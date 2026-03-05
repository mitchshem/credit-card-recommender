# Monetization Plan (Safe MVP Constraints)

This plan prioritizes monetization readiness while keeping the MVP safe:
- No live payments
- No production deployment for monetization paths
- No active affiliate/sponsored claim until legal and technical checks are complete

## Phase 1: Placeholder Offers (Current)

Goal: Validate UX interest before activation.

- Use a structured, local config to define offer inventory.
- Render offer cards from config, not hardcoded JSX.
- Keep all offers inactive (`isActive=false`) with a clear "Coming Soon" CTA state.
- Track click intent locally (localStorage) for directional demand signals.
- No redirects for inactive offers.

Success metrics:
- Number of click intents by offer/category.
- Repeated intent volume across sessions.

## Phase 2: Affiliate Links (After Validation)

Goal: Activate low-friction revenue with controlled scope.

- Turn on selected offers (`isActive=true`) one by one.
- Use approved affiliate URLs only; keep destination allowlist in config/review checklist.
- Log outbound click events to backend analytics (replace local-only tracking).
- Add visible disclosure text for affiliate relationships.
- Add offer QA checklist (broken link, destination mismatch, mobile behavior).

Success metrics:
- Outbound click-through rate by placement/category.
- Affiliate conversion and EPC from partner reports.

## Phase 3: Premium Subscription (Post-Affiliate Baseline)

Goal: Add direct recurring revenue after core trust and retention stabilize.

- Gate premium features behind feature flags first (no billing enabled initially).
- Add entitlement checks and fallback UX before any checkout is introduced.
- Introduce pricing experiments only after baseline retention and advisor accuracy KPIs are met.
- Roll out billing in staging first; production only after end-to-end test pass and support playbook.

Potential premium scope:
- Advanced recommendation modes
- Portfolio optimization insights
- Historical earnings tracking and what-if analysis

## Safety and Compliance Notes

- Do not imply active sponsorships/affiliate relationships unless contracts are in place.
- Add FTC-style disclosure language when affiliate links are activated.
- Respect card-network and issuer trademark usage rules in offer copy.
- Avoid financial guarantees; position recommendations as informational.
- Keep user data minimal for intent tracking and document retention policy before backend analytics migration.
- Add legal/compliance review before enabling production monetization flows.
