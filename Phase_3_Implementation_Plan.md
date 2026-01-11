# Phase 3 Implementation Plan: Design Token Bridge + CSS Layers (Frontend Foundation)

## Phase 3.1: Frontend Scaffold & Dependencies

### 1. `frontend/` (Scaffold)
- **Purpose**: Initialize the Next.js 15 framework structure.
- **Action**: Run `npx create-next-app@latest frontend` with the following flags:
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: No (We will install v4 manually to ensure correct setup)
  - `src/` directory: No (Use `app/` at root for simpler monorepo structure)
  - App Router: Yes
  - Import alias: `@/*`
- **Checklist**:
  - [ ] `frontend/app/` exists.
  - [ ] `frontend/package.json` exists.
  - [ ] `frontend/tsconfig.json` exists.

### 2. `frontend/package.json` (Update)
- **Purpose**: Install Tailwind CSS v4 and Shadcn/Radix dependencies.
- **Action**: 
  - Install dependencies: `next`, `react`, `react-dom`, `tailwindcss@next`, `@tailwindcss/postcss@next`, `postcss` (if needed for v4 beta), `clsx`, `tailwind-merge`, `class-variance-authority`.
  - Ensure scripts include `dev`, `build`, `start`, `lint`.
- **Checklist**:
  - [ ] `tailwindcss` version is `^4.0.0` (or compatible beta/next tag).
  - [ ] Dependencies listed in `Phase 3` of MEP are present.

### 3. `frontend/next.config.mjs` (Update)
- **Purpose**: Configure Next.js.
- **Action**: Ensure minimal config. Enable any necessary flags for Tailwind v4 if required (though v4 is mostly CSS-side).
- **Checklist**:
  - [ ] Valid ESM config file.

### 4. `frontend/.env.example` (Create)
- **Purpose**: Frontend environment template.
- **Content**:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`
  - `STRIPE_SECRET_KEY=`
- **Checklist**:
  - [ ] Matches `Master_Execution_Plan.md` requirements.

## Phase 3.2: Design Token Bridge & CSS Architecture

### 1. `frontend/app/globals.css` (Create/Overwrite)
- **Purpose**: Authoritative CSS source using Tailwind v4 native layers.
- **Content**:
  - `@import "tailwindcss";`
  - `@layer tokens { ... }`: Define CSS variables for colors, typography, spacing (from `cafe.html`).
  - `@theme { ... }`: Map Tailwind theme keys to these variables.
  - `@layer base { ... }`: Global resets, typography defaults (font-family).
  - `@layer components { ... }`: Placeholders for future component styles.
  - `@layer utilities { ... }`: Custom utilities if needed.
  - `@layer overrides { ... }`: Animation keyframes, specific overrides.
- **Checklist**:
  - [ ] Includes Peranakan palette: `nyonya-cream`, `kopi-brown`, `terracotta`, `heritage-blue`, `gold-leaf`.
  - [ ] Includes fluid type scale variables.
  - [ ] Includes `folio-frame` styles in `components` or `utilities` layer.

### 2. `frontend/design-tokens/index.ts` (Create)
- **Purpose**: TypeScript source of truth for design tokens, mirrored from `globals.css` for use in JS logic (e.g., Framer Motion).
- **Content**:
  - Export `const tokens = { colors: { ... }, spacing: { ... }, fonts: { ... } }`.
- **Checklist**:
  - [ ] Values match `globals.css` exactly.
  - [ ] Typed exports for type safety.

### 3. `frontend/lib/cn.ts` (Create)
- **Purpose**: Utility for merging Tailwind classes.
- **Content**: Standard `clsx` + `tailwind-merge` implementation.
- **Checklist**:
  - [ ] Exports `cn` function.

### 4. `frontend/app/layout.tsx` (Update)
- **Purpose**: Root layout setup.
- **Action**:
  - Import `globals.css`.
  - Configure fonts (`Cormorant Garamond`, `Crimson Pro`, `Pinyon Script`) using `next/font/google`.
  - Apply global background color (`nyonya-cream`) and text color (`kopi-brown`).
  - Add `<div id="skip-nav">` container.
- **Checklist**:
  - [ ] `lang="en-SG"` set.
  - [ ] Fonts variables applied to `<body>`.

## Validation Criteria
- [ ] `npm run build` in `frontend/` succeeds.
- [ ] A test page (e.g., modified `page.tsx`) rendering a simple element with `bg-nyonya-cream text-kopi-brown font-heading` displays correctly in a browser (or visual inspection of generated CSS).
- [ ] Tailwind v4 imports function without error.
