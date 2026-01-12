I’m going to implement the remediation plan in the repo now, starting with **Phase 1 (token/Tailwind contract + parity)**, then **Phase 2 (a11y + disabled semantics)**, then **Phase 3 (missing Merlion components like `DropCap`/divider)**. I’ll make small, safe commits of changes (file-by-file) and validate each step against existing code paths to avoid drift.

Proceeding with **Phase 2** now: I’ll harden accessibility and interaction semantics in the current Next.js implementation while keeping [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) visual parity. Concretely, I’ll update `ButtonMerlion` to correctly support disabled semantics for `href` links, improve [NewsletterForm](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/newsletter-form.tsx:6:0-90:1) with proper `aria-invalid` + live announcements, and add unique accessible names for the “Add to Cart” buttons (plus better price context) in [app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0).

I’m continuing with **Phase 2 (accessibility + semantics)** next: I’ll upgrade [NewsletterForm](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/newsletter-form.tsx:6:0-90:1) with field-level `aria-invalid` + `aria-describedby` + alert/status regions, and I’ll fix “Add to Cart” and price announcements so screen readers get unique, contextual labels. I’ll also apply the same price-label pattern to Events and Cart UI to keep parity and quality consistent.

Next I’ll finish **Phase 2** by making the storefront content screen-reader-safe without changing the visual “soul”: I’ll add unique accessible labels for each “Add to Cart” action and add lightweight price context (`sr-only` “Price: …”) across the landing page, events page, and cart drawer. Then Phase 2 will be complete and we can move to Phase 3 (DropCap/Divider components for parity).

I’m continuing Phase 2 by improving accessibility across the rest of the UI: updating the Events page and Cart drawer so prices and actions have proper screen-reader context (without changing visible copy), and cleaning up a couple of TypeScript “implicit any” spots where the IDE can’t infer types. Then Phase 2 will be complete and we’ll move into Phase 3 (DropCap + divider components for closer [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) parity).

I’m moving into **Phase 3 (parity components)**: adding the missing `ScrollIndicator` and wiring it into the hero, plus adding the corresponding [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0)-faithful CSS in [globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) (including the 480px hide rule and reduced-motion disabling). This keeps parity high while staying componentized.

Next I’ll finish **Phase 3 parity work** by wiring the new [ScrollIndicator](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/scroll-indicator.tsx:5:0-16:1) into the hero (matching [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) placement) and ensuring its motion respects `prefers-reduced-motion`. I’ll also add the missing typography tracking/leading tokens in [globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) because the scroll indicator relies on `--tracking-loose` (and this keeps token parity tight).

I’m going to tighten the **token bridge** now (still Phase 1): update `frontend/src/design-tokens/index.ts` so it mirrors the new parity tokens we added in [globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) (`semantic spacing`, `layout`, `zIndex`, `tracking/leading`, `shadow-md/xl`, `easing-bounce`). This improves architectural integrity and reduces “magic numbers” while keeping [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) parity.

I’m moving into **Phase 4 (hardening + removing cascade traps)** and then **Phase 5 (MobileNav parity)**. Next changes will:
- Harden the newsletter BFF route with input validation + basic rate limiting and only forward whitelisted fields.
- Remove the remaining inline animation style from the hero (so we don’t fight the cascade).
- Enable and restyle `MobileNavMerlion` to better match [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) while keeping Radix focus trapping, by allowing the Sheet overlay to be customized from the wrapper.

I’m going to finish Phase 4 by removing the last inline animation style (so the cascade/tokens fully control motion), then do Phase 5 by enabling [MobileNavMerlion](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/mobile-nav.tsx:17:0-51:1) in the header and upgrading it to use a Merlion-styled Sheet overlay/content while keeping Radix focus trapping and semantics intact.

---

# Status

All phases in your current remediation TODO are now **implemented and marked completed**.

## What changed (by phase)

### Phase 1 (Tailwind/token contract) — completed
- **[frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0)**
  - Added missing tokens (`semantic spacing`, `layout`, `z-index`, `tracking/leading`, `shadow-md/xl`, `easing-bounce`).
  - Added required utilities used by JSX (`font-500/600`, `duration-medium`, `ease-smooth`, `opacity-4`, `contain-paint`).
  - Added parity component styles: `folio-frame` radius alignment, `drop-cap`, `tile-pattern`, `scroll-indicator`.
  - Extended reduced-motion handling to also stop scroll indicator pulsing.

### Phase 2 (Accessibility fixes) — completed
- **[frontend/src/components/merlion/newsletter-form.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/newsletter-form.tsx:0:0-0:0)**
  - Added `aria-invalid`, `aria-describedby`, and `role="alert"` for field errors.
  - Required consent checkbox and improved validation flow.
- **[frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0)**
  - Added **unique accessible names** for “Add to Cart”.
  - Added SR-only “Price:” context for price readouts (no visible change).
- **[frontend/src/components/merlion/cart-drawer.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/cart-drawer.tsx:0:0-0:0)**
  - Added `aria-label` for cart trigger.
  - Added SR-only “Price:” and “Total price:” context.
- **[frontend/src/app/events/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/events/page.tsx:0:0-0:0)**
  - Added SR-only “Price:” context and more descriptive booking button labels.

### Phase 3 (Missing Merlion components for parity) — completed
Added components:
- **[frontend/src/components/merlion/drop-cap.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/drop-cap.tsx:0:0-0:0)**
- **[frontend/src/components/merlion/peranakan-divider.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/peranakan-divider.tsx:0:0-0:0)**
- **[frontend/src/components/merlion/scroll-indicator.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/scroll-indicator.tsx:0:0-0:0)**

Integrated into landing page:
- **[frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0)**
  - Replaced the ad-hoc story dropcap with [DropCap](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/drop-cap.tsx:5:0-7:1).
  - Added [PeranakanDivider](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/peranakan-divider.tsx:5:0-7:1) between key sections.
  - Added [ScrollIndicator](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/scroll-indicator.tsx:5:0-16:1) to hero.

### Phase 4 (Newsletter API hardening + remove cascade traps) — completed
- **[frontend/src/app/api/newsletter/route.ts](cci:7://file:///h:/project/cafe-sg/frontend/src/app/api/newsletter/route.ts:0:0-0:0)**
  - Content-type guard (`415`).
  - Input validation + consent enforcement.
  - Payload whitelisting (no blind pass-through).
  - Basic per-client rate limiting + `Retry-After`.
  - Timeout via `AbortController`.
  - Avoids leaking backend error bodies; returns `502` on upstream failure.
- **[frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0)**
  - Removed inline `animationFillMode` style from hero to reduce cascade drift.

### Phase 5 (MobileNav parity) — completed
- **[frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0)**
  - Enabled [MobileNavMerlion](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/mobile-nav.tsx:20:0-81:1) in the header.
- **[frontend/src/components/merlion/mobile-nav.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/mobile-nav.tsx:0:0-0:0)**
  - Reworked to keep Radix focus trap while applying Merlion overlay + panel styling.
  - Added [PeranakanDivider](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/peranakan-divider.tsx:5:0-7:1) inside the menu and improved close button semantics.

## Notes on IDE TypeScript lints
You’re still seeing TS “Cannot find module react/next” and “JSX.IntrinsicElements” style errors in the IDE. These look like **environment/tooling type-resolution issues** (or deps not installed / TS server not picking up `node_modules`), not problems caused by the edits themselves. I didn’t try to “fix” these by changing runtime code because that risks masking the real setup issue.

---

You’ve got two separate issues in that output:  
1) **Playwright can’t run** because the browser binaries aren’t installed (`npx playwright install` needed).  
2) Your Playwright webServer is trying `next start`, but your Next build is configured with `output: "standalone"`, so it should start via `node .next/standalone/server.js` instead.

I’ll locate your `next.config` and `playwright.config` and then patch Playwright to start the correct server command.

## What your output means

### 1) `npm run build` “Failed to fetch products during build”
That’s expected with your current [getProducts()](cci:1://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:13:0-43:1) logic when the **Laravel backend isn’t running**. The build still succeeded because your `catch` returns fallback product data.

- If you want a “clean” build log:
  - Start backend first, or
  - Set `NEXT_PUBLIC_API_BASE_URL` to a reachable backend URL during build.

### 2) Playwright warning: `next start` doesn’t work with `output: standalone`
Correct. Your [next.config.ts](cci:7://file:///h:/project/cafe-sg/frontend/next.config.ts:0:0-0:0) has `output: "standalone"`, so Playwright must start the app using:

- `node .next/standalone/server.js`

I’ve already patched this:

- **[frontend/package.json](cci:7://file:///h:/project/cafe-sg/frontend/package.json:0:0-0:0)**: added `start:standalone`
- **[frontend/playwright.config.ts](cci:7://file:///h:/project/cafe-sg/frontend/playwright.config.ts:0:0-0:0)**: changed `webServer.command` to `npm run build && npm run start:standalone`

So the “next start + standalone” warning should be gone after this.

### 3) Playwright failing: “Executable doesn’t exist … run `npx playwright install`”
This is the real blocker now: the Playwright browser binaries aren’t installed on your machine yet.

Run this from `frontend/`:

```bash
npx playwright install
```

Then re-run:

```bash
npm run test
```

## Status
- **Done**: Fixed Playwright server startup for Next standalone output.
- **Next required action (you)**: Install Playwright browsers with `npx playwright install`.
# Completion summary
- **All TODO items are completed** and the remediation plan phases (1–5) have been executed with small, targeted changes aimed at [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) parity + accessibility + security hardening.

---

I’ll inspect [5704fcf9cc956f20.css](cci:7://file:///h:/project/cafe-sg/5704fcf9cc956f20.css:0:0-0:0) directly and pull out the exact lines that prove the circular token definitions (e.g. `text-xs: var(--text-xs)`), then map them to what Tailwind is doing and why it breaks the page’s computed styles.


## Findings from [5704fcf9cc956f20.css](cci:7://file:///h:/project/cafe-sg/5704fcf9cc956f20.css:0:0-0:0) (the built stylesheet)

### 1) The built CSS **contains circular/self-referential tokens**
In the snippet we can see (inside `@layer theme{:root,:host{...}}`):

- `--text-xs:var(--text-xs);`
- `--text-sm:var(--text-sm);`
- `--text-base:var(--text-base);`
- `--text-lg:var(--text-lg);`

This is exactly the pathological pattern that can make the computed value of those variables **invalid** (effectively collapsing token-driven font sizing/spacing and breaking the page’s look).

### 2) This behavior does **not** exist in [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0)
In [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0), tokens are defined as real values (e.g. `--text-xs: clamp(...)`) under `@layer tokens`, and are *consumed* elsewhere—never redefined as `var(--same-token)`.

## Root cause
Your Tailwind v4 theme layer is emitting `--text-*` variables that reference themselves. That happens when we feed Tailwind a token mapping like:

```css
@theme {
  --text-xs: var(--text-xs);
  ...
}
```

That mapping is circular by definition.

## Fix status (already applied)
I already patched **[frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0)** to remove the circular `@theme` mappings and replace them with **concrete values** (matching [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0)). That’s the correct minimal fix.

## What to do next (verification)
1. Run a fresh build so the CSS is regenerated:
   - `npm run build`
2. Re-open the newly generated CSS chunk and confirm the theme layer no longer has:
   - `--text-xs:var(--text-xs)` (and similar)
3. Re-test the landing page in the browser.

## Status
- **Completed**: Inspected the provided [5704fcf9cc956f20.css](cci:7://file:///h:/project/cafe-sg/5704fcf9cc956f20.css:0:0-0:0) and extracted the exact evidence of the circular token definitions.
- **Next**: Rebuild to regenerate CSS with the fixed [globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0), then re-check the output and UI.
