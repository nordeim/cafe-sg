# Phase 5 Implementation Plan: Storefront Pages (Content + Catalog)

## Phase 5.1: Backend Catalog Foundation

### 1. `backend/app/Http/Controllers/ProductController.php` (Update)
- **Purpose**: Implement the public catalog endpoints.
- **Content**:
  - Method `index()`: Return all active products with JSON structure: `{ data: [ { slug, name, description, price_cents, ... } ] }`.
  - Method `show($slug)`: Return single product details.
- **Checklist**:
  - [ ] Returns valid JSON.
  - [ ] Maps `price_cents` correctly.
  - [ ] Filters by `is_active = true`.

### 2. `backend/routes/api.php` (Update)
- **Purpose**: Define public routes.
- **Content**:
  - `GET /api/v1/products` -> `ProductController@index`
  - `GET /api/v1/products/{slug}` -> `ProductController@show`
- **Checklist**:
  - [ ] Versioned routes exist.

### 3. `backend/database/seeders/ProductSeeder.php` (Create)
- **Purpose**: Seed the "Heritage Bean Collection" from `cafe.html`.
- **Content**:
  - Create 3 products: "Singapore Heritage Blend", "Peranakan Estate", "Straits Sourcing".
  - Use prices and descriptions from `cafe.html`.
- **Checklist**:
  - [ ] Seeder runs without error.
  - [ ] Data matches `cafe.html`.

## Phase 5.2: Frontend BFF & Pages

### 1. `frontend/src/app/api/catalog/route.ts` (Create)
- **Purpose**: BFF route to fetch products from Laravel (avoiding CORS/exposure of internal API details if needed, though direct fetching is also okay for public data; we'll use BFF for caching control).
- **Content**:
  - `GET` handler fetching from `NEXT_PUBLIC_API_BASE_URL/api/v1/products`.
  - Sets Cache-Control headers.
- **Checklist**:
  - [ ] Fetches data successfully.
  - [ ] Returns sanitized JSON.

### 2. `frontend/src/app/page.tsx` (Update)
- **Purpose**: The main landing page implementing `cafe.html`.
- **Content**:
  - **Hero Section**: `<h1>` with `font-heading`, floating beans animation.
  - **Collection Section**: Fetches products via `api/catalog` (or direct server fetch). Renders `ZigzagSection` with `ZigzagItem` components.
  - **Story Section**: Static content using `TextureOverlay` and typography tokens.
  - **Footer**: Static compliance footer.
- **Checklist**:
  - [ ] Uses `ZigzagSection` for products.
  - [ ] "Add to Cart" buttons are present (can be non-functional for this phase, just UI).
  - [ ] Floating beans animation is visible.

### 3. `frontend/src/components/merlion/product-card.tsx` (Optional/Refactor)
- **Purpose**: If `CardMerlion` needs specific product logic (price formatting), create a composition here.
- **Content**:
  - Takes product data.
  - Renders image, title, price (formatted SGD), and "Add to Cart" `ButtonMerlion`.
- **Checklist**:
  - [ ] Prices displayed inclusive of GST (e.g., "$28.00 SGD (Incl. 9% GST)").

## Validation Criteria
- [ ] `php artisan db:seed` populates the database.
- [ ] Visiting `http://localhost:3000` shows the Hero, Products (fetched from DB), and Story sections.
- [ ] Visual fidelity matches `cafe.html` (typography, spacing, ornaments).
