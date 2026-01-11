# Phase 4 Implementation Plan: Merlion Component System (Shadcn Primitives + Wrappers)

## Phase 4.1: Shadcn Foundation

### 1. `frontend/components/ui/` (Install Primitives)
- **Purpose**: Install necessary Shadcn UI components as the foundational layer.
- **Action**: Use the shadcn-ui CLI (or copy the code manually if CLI is tricky in this environment) to add:
  - `button`
  - `card`
  - `sheet` (for mobile nav)
  - `dialog` (if needed, or sheet covers it)
- **Checklist**:
  - [ ] `frontend/components/ui/button.tsx` exists.
  - [ ] `frontend/components/ui/card.tsx` exists.
  - [ ] `frontend/components/ui/sheet.tsx` exists.
  - [ ] `frontend/lib/utils.ts` (or `cn.ts`) is correctly referenced by these components.

## Phase 4.2: Merlion Wrappers (The Soul)

### 1. `frontend/components/merlion/button-merlion.tsx` (Create)
- **Purpose**: Extended button with the "hover underlay" animation from `cafe.html`.
- **Content**:
  - Accepts `variant` ('primary' | 'secondary').
  - Wraps `Button` from `ui/button`.
  - Adds a pseudo-element (or span) for the slide-in background effect.
- **Checklist**:
  - [ ] Exports `ButtonMerlion`.
  - [ ] Animation classes match `cafe.html` (`transform: scaleX(0)` -> `scaleX(1)` on hover).

### 2. `frontend/components/merlion/card-merlion.tsx` (Create)
- **Purpose**: Extended card with the `folio-frame` double-border effect.
- **Content**:
  - Wraps `Card` from `ui/card`.
  - Prop `withFolioFrame` (default true).
  - Applies `folio-frame` class (defined in `globals.css`).
- **Checklist**:
  - [ ] Exports `CardMerlion`.
  - [ ] Supports `className` prop merging.

### 3. `frontend/components/merlion/ornament.tsx` (Create)
- **Purpose**: Reusable SVG component for the "Peranakan Corner" ornaments.
- **Content**:
  - Prop `position`: `'tl' | 'tr' | 'bl' | 'br'`.
  - Renders the SVG paths from `cafe.html`.
  - Applies rotation based on position.
- **Checklist**:
  - [ ] SVG paths match `cafe.html`.
  - [ ] Positioning classes (`top-0 left-0`, etc.) are correct.

### 4. `frontend/components/merlion/texture-overlay.tsx` (Create)
- **Purpose**: Global paper fiber noise overlay.
- **Content**:
  - Fixed position div.
  - CSS radial-gradient background (matches `cafe.html`).
  - `pointer-events-none`.
- **Checklist**:
  - [ ] Renders invisible to clicks.
  - [ ] Z-index is correct (below content, above background).

### 5. `frontend/components/merlion/zigzag.tsx` (Create)
- **Purpose**: Editorial layout component.
- **Content**:
  - Container with `flex flex-col gap-16`.
  - Item wrapper that toggles `flex-row` / `flex-row-reverse` (or CSS grid with `direction: rtl` if sticking strictly to `cafe.html` technique, but flex order is often easier in React). *Decision*: Use `even:flex-row-reverse` utility for simplicity unless `direction: rtl` was crucial for text flow (it was mostly for image/text swap).
  - **Correction**: `cafe.html` used `direction: rtl`. To preserve "soul", we should replicate the *visual result*. Flex `row-reverse` is safer for accessibility unless the text language actually changes. We will use `even:flex-row-reverse`.
- **Checklist**:
  - [ ] Accepts a list of items (image + content).
  - [ ] Alternates layout.

### 6. `frontend/components/merlion/mobile-nav.tsx` (Create)
- **Purpose**: The mobile navigation menu with "soulful" transitions.
- **Content**:
  - Uses `Sheet` primitive.
  - Custom trigger (hamburger icon).
  - Custom content (nav links).
  - Matches `cafe.html` font sizes for mobile menu items.
- **Checklist**:
  - [ ] `aria-expanded` attributes handled by Sheet primitive.
  - [ ] Links close the sheet when clicked.

## Validation Criteria
- [ ] `npm run build` succeeds.
- [ ] A test page using `<ButtonMerlion>` and `<CardMerlion>` renders with correct styles (checked via visual inspection of class names in code or running dev server if possible).
