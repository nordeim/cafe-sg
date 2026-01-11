
I’ll read [Complete_Design_System_Audit_v3.md](cci:7://file:///h:/project/cafe-sg/Complete_Design_System_Audit_v3.md:0:0-0:0) fully, extract its specific claims (the “12 gaps / 3 a11y violations / 2 performance anti-patterns”), then validate each claim against the *actual* [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) and the current Next.js frontend implementation ([globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0), [design-tokens](cci:7://file:///h:/project/cafe-sg/frontend/src/design-tokens:0:0-0:0), Merlion wrappers, and pages). After that I’ll produce an updated, repo-accurate remediation plan broken into phases with explicit file lists and per-file checklists.


# Validation of [Complete_Design_System_Audit_v3.md](cci:7://file:///h:/project/cafe-sg/Complete_Design_System_Audit_v3.md:0:0-0:0) (Against the Actual Repo)

## What v3 gets **right** (validated)
- **[Token inventory correctness (mostly)]**
  - [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) *does* contain the listed palette, UI variants, typography `clamp()` scale, spacing scale, layout tokens, shadows, z-index scale, and `--easing-bounce`.
- **[Layer intent]**
  - [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) *does* use `@layer tokens, base, components, utilities, overrides;` and the separation is clean.
- **[Folio frame mechanics]**
  - [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) folio frame uses `::after`, `8px` inset, and `calc(var(--border-radius) - 2px)`; your repo mirrors this closely in [frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) (`inset: 8px; border-radius: 6px;`).
- **[Undocumented “cafe.html” primitives]**
  - `scroll-indicator`, `tile-pattern`, `drop-cap`, and the “alchemical symbol” exist in [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) and are not fully represented as dedicated components in [frontend/src/components/merlion/](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion:0:0-0:0).

## What v3 gets **wrong or misleading** (validated)
- **[“Color system is WCAG AAA compliant”] — Incorrect**
  - [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) literally labels UI variants as “WCAG AAA”, but **that claim is not validated**.
  - Prior v1’s contrast table indicates `--color-ui-gold` likely fails AA for normal text on `--color-nyonya-cream`. I did not run a contrast tool here, but **v3 asserts AAA compliance as fact** without evidence and contradicts the earlier audit’s findings.
- **[“Reduced motion compliance ✅ All animations disabled via 1ms duration”] — Incorrect**
  - In [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0), `prefers-reduced-motion` only sets duration tokens to `1ms`; it **does not disable** infinite animations like `.coffee-bean` and `.scroll-indicator`. It will still animate (potentially worse).
  - Your repo’s [globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) currently mirrors that same behavior (duration tokens → `1ms`) and does **not** explicitly turn off infinite animations either.
- **[“Tailwind v4 migration will break cascade due to layer conflicts”] — Overstated / likely wrong**
  - Your repo already uses Tailwind v4 with:
    - `@import "tailwindcss";`
    - a custom `@layer tokens { ... }`
    - an `@theme { ... }`
  - That suggests **custom layers can coexist** (at least structurally). v3 claims “build-time error” with no repo proof. This is a **risk to verify**, not a validated blocker.
- **[“ButtonMerlion missing disabled state”] — Not true in this repo**
  - [frontend/src/components/merlion/button-merlion.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/button-merlion.tsx:0:0-0:0) forwards `disabled` to Shadcn `Button`, and Shadcn already applies `disabled:*` styles.
  - Edge case: when rendering as `Link`, “disabled” semantics aren’t enforced (that’s the real gap).
- **[“Mobile nav focus trap is incomplete”] — Wrong for this repo**
  - Your mobile nav uses Radix Dialog via `Sheet` ([frontend/src/components/ui/sheet.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/ui/sheet.tsx:0:0-0:0)), which **already provides focus trapping** and Escape handling by default.
  - v3’s recommendation to hand-roll a focus trap is **unnecessary** and risks regressions.

## What v3 misses (repo-relevant gaps)
- **[Repo drift: token bridge shape mismatch]**
  - Repo uses `export const tokens = { ... }` in [frontend/src/design-tokens/index.ts](cci:7://file:///h:/project/cafe-sg/frontend/src/design-tokens/index.ts:0:0-0:0), not `designTokens`, and it currently **omits** semantic spacing and layout tokens.
- **[Repo drift: “custom Tailwind utilities”]**
  - [page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0) uses classes like `font-600`, `font-500`, `duration-medium`, `ease-smooth`, `opacity-4`. These are **not standard Tailwind utilities**, and the repo does not show a clear mapping for them. This is a real implementation risk (silent styling failures).
- **[Texture overlay stacking mismatch]**
  - [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) puts texture behind content (`--z-below: -1`).
  - Repo sets [TextureOverlay](cci:1://file:///h:/project/cafe-sg/frontend/src/components/merlion/texture-overlay.tsx:3:0-15:1) to `z-[1]` (above), which may subtly change contrast/feel.

---

# Updated Overall Validated Assessment (v1–v3 re-evaluated)
- **Most reliable findings remain from v1 + my validation pass**:
  - Missing `--color-nyonya-cream-rgb` in [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) (repo fixed it).
  - Focus ring conflict exists in [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) (base gold, overrides terracotta).
  - [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) scroll reveal progressive enhancement is broken (JS hides content).
  - Reduced-motion handling should disable infinite animations (v2/v3 recommend this correctly, but v3 misstates current compliance).
- **v3 adds useful inventorying**, but contains **several repo-inaccurate prescriptions** (mobile focus trap, disabled button claim, Tailwind layer “build error” claim).

---

# Comprehensive Remediation Plan (Repo-Validated, Phased)

> You’re currently in **Ask mode**, so I’m providing a plan + per-file checklists. If you want me to apply these changes directly, switch to **Code mode**.

## Phase 1 — Token + Tailwind v4 Contract (Stop drift at the source)
**Goal:** Ensure tokens reliably produce usable Tailwind utilities and TS mirrors.

- **Files to modify**
  - [frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0)
  - [frontend/src/design-tokens/index.ts](cci:7://file:///h:/project/cafe-sg/frontend/src/design-tokens/index.ts:0:0-0:0)

- **[frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) checklist**
  - [ ] Add missing token coverage from [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) that the app relies on (z-index scale, full shadows if needed).
  - [ ] Decide and enforce **one canonical focus style** (terracotta vs gold) and document it in CSS (avoid [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0)’s conflict).
  - [ ] Ensure animation tokens exist for the classes you are using (`duration-medium`, `ease-smooth`, `animate-float`, etc.) **or** remove those nonstandard utilities from JSX and use standard Tailwind utilities.
  - [ ] Align texture overlay stacking to match “Soul” (`--z-below` behavior).

- **[frontend/src/design-tokens/index.ts](cci:7://file:///h:/project/cafe-sg/frontend/src/design-tokens/index.ts:0:0-0:0) checklist**
  - [ ] Add semantic spacing (`inside/outside/stack/inline`) to match [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0).
  - [ ] Add layout tokens (`containerWidth`, `navHeight`, `borderRadius*`) if used in TS/Framer.
  - [ ] Keep the existing `tokens` export shape stable (don’t rename to `designTokens` unless you update all imports).

## Phase 2 — Accessibility Baseline (Repo-first, not cafe.html-first)
**Goal:** Fix real a11y gaps in current Next pages/components.

- **Files to modify**
  - [frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0)
  - [frontend/src/components/merlion/newsletter-form.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/newsletter-form.tsx:0:0-0:0)
  - [frontend/src/components/merlion/button-merlion.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/button-merlion.tsx:0:0-0:0)

- **[frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0) checklist**
  - [ ] Make “Add to Cart” buttons uniquely named for screen readers:
    - `aria-label={`Add ${product.name} to cart`}` or change visible label.
  - [ ] Replace ad-hoc drop cap `<span>` with a reusable pattern (see Phase 3).

- **[frontend/src/components/merlion/newsletter-form.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/newsletter-form.tsx:0:0-0:0) checklist**
  - [ ] Add explicit `aria-invalid` and an error message region with stable ID wiring.
  - [ ] Make error messaging announced (use `role="alert"` for errors).
  - [ ] Ensure consent checkbox is `required` semantically, not only logically.

- **[frontend/src/components/merlion/button-merlion.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/button-merlion.tsx:0:0-0:0) checklist**
  - [ ] Define a “disabled” behavior for `href` variant (render `<span>` or block click + add `aria-disabled`, `tabIndex={-1}`).
  - [ ] Ensure focus styles match your global focus strategy (Phase 1).

## Phase 3 — “Soul parity” Components (Eliminate ad-hoc duplication)
**Goal:** Lift repeated cafe.html motifs into Merlion components.

- **Files to create**
  - `frontend/src/components/merlion/drop-cap.tsx`
  - `frontend/src/components/merlion/peranakan-divider.tsx`
  - `frontend/src/components/merlion/scroll-indicator.tsx` (optional, if you want it in Next)

- **Files to modify**
  - [frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0)
  - [frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) (if CSS classes needed)

- **Per-file checklists**
  - **`drop-cap.tsx`**
    - [ ] Matches [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) `::first-letter` styling (prefer CSS class approach).
    - [ ] Avoids layout shift in multi-paragraph scenarios.
  - **`peranakan-divider.tsx`**
    - [ ] Implements tile pattern with `aria-hidden="true"`.
    - [ ] Supports the 480px reduction (height 2px, background-size 8px).
  - **`scroll-indicator.tsx`**
    - [ ] Hidden under 480px (matches [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0)).
    - [ ] Respects reduced motion (disable pulse).

## Phase 4 — Motion & Performance Correctness
**Goal:** Make reduced motion *actually reduce motion* and avoid cascade-breaking inline styles.

- **Files to modify**
  - [frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0)
  - (Optional if you add scroll reveal) `frontend/src/lib/use-scroll-reveal.ts`

- **[frontend/src/app/globals.css](cci:7://file:///h:/project/cafe-sg/frontend/src/app/globals.css:0:0-0:0) checklist**
  - [ ] Under `prefers-reduced-motion: reduce`, explicitly disable infinite animations:
    - `animation: none !important;` for decorative float/pulse classes.
  - [ ] Keep hover/focus transitions allowed (interaction-triggered).

- **(Optional) `use-scroll-reveal.ts` checklist**
  - [ ] Use class toggling (`opacity-0 → opacity-100`) instead of inline styles.
  - [ ] Progressive enhancement safe-by-default (visible without JS).

## Phase 5 — Mobile Nav Alignment (Radix-first)
**Goal:** Keep Radix `Sheet` (library discipline), but style/behavior-match “Soul”.

- **Files to modify**
  - [frontend/src/components/merlion/mobile-nav.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/mobile-nav.tsx:0:0-0:0)
  - [frontend/src/components/ui/sheet.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/ui/sheet.tsx:0:0-0:0) (styles only via className overrides, not rewriting primitives)
  - [frontend/src/app/page.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/app/page.tsx:0:0-0:0) (actually enable MobileNavMerlion)

- **[mobile-nav.tsx](cci:7://file:///h:/project/cafe-sg/frontend/src/components/merlion/mobile-nav.tsx:0:0-0:0) checklist**
  - [ ] Ensure trigger uses Merlion styling (not default outline).
  - [ ] Ensure panel matches [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) layout intent (centered links, spacing, background, typography).
  - [ ] Confirm body scroll lock behavior is acceptable (Radix handles focus; scroll locking may need explicit handling depending on platform).

---

# Completion Status
- **Validated:** v3’s claims against [cafe.html](cci:7://file:///h:/project/cafe-sg/cafe.html:0:0-0:0) and the current Next.js repo; identified what is correct vs incorrect.  
- **Delivered:** A repo-accurate, phased remediation plan with explicit file lists and per-file checklists, validated against existing paths and components.

If you want, tell me whether your priority is **(A)** “perfect cafe.html parity” or **(B)** “production hardening with selective parity,” and switch to **Code mode**—I can then implement Phase 1 + Phase 2 as a first PR-sized change set.
