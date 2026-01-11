# Phase 11 Implementation Plan: Experiences & Events Booking

## Phase 11.1: Backend Event Infrastructure

### 1. `backend/database/migrations/xxxx_xx_xx_create_events_tables.php` (Create)
- **Purpose**: Store event details, sessions (dates/times), and user bookings.
- **Content**:
  - `events`: `id` (UUID), `slug`, `title`, `description`, `price_cents`, `duration_minutes`.
  - `event_sessions`: `id` (UUID), `event_id` (FK), `starts_at` (timestamp), `capacity` (int), `booked_count` (int).
  - `bookings`: `id` (UUID), `session_id` (FK), `user_email`, `quantity`, `status` (pending/confirmed/cancelled), `payment_id` (nullable).
- **Checklist**:
  - [ ] Indexes on `starts_at` for querying upcoming sessions.
  - [ ] Optimistic locking columns (`booked_count`).

### 2. `backend/app/Models/*` (Create)
- **Purpose**: Eloquent models.
- **Content**: `Event`, `EventSession`, `Booking`.
- **Checklist**:
  - [ ] Relationships defined (`Event` hasMany `EventSession`, `EventSession` hasMany `Booking`).

### 3. `backend/app/Services/CapacityService.php` (Create)
- **Purpose**: Handle booking logic with concurrency control.
- **Content**:
  - `reserve(sessionId, email, qty)`:
    - Transaction start.
    - Check `capacity - booked_count >= qty`.
    - Increment `booked_count`.
    - Create `Booking` (status: confirmed for MVP free/pay-at-door events, or pending if paid).
    - **Decision**: For MVP simplicity, assume "Pay at Door" or "Free" to avoid another Stripe integration loop, OR reuse StripeService if time permits. Let's aim for **Confirmed immediately** (Pay at Door/Reservation only) to match the "Reservation" terminology in `cafe.html`.
- **Checklist**:
  - [ ] Prevents overbooking.

### 4. `backend/app/Http/Controllers/BookingController.php` (Create)
- **Purpose**: API endpoints.
- **Content**:
  - `index()`: List upcoming events + sessions.
  - `store()`: Create booking.
- **Checklist**:
  - [ ] Validates email and quantity.

### 5. `backend/routes/api.php` (Update)
- **Purpose**: Register routes.
- **Content**:
  - `GET /events`
  - `POST /bookings`
- **Checklist**:
  - [ ] Publicly accessible.

## Phase 11.2: Frontend Booking UI

### 1. `frontend/src/app/events/page.tsx` (Create)
- **Purpose**: dedicated events page (or section).
- **Content**:
  - List events using `CardMerlion`.
  - "Book Now" opens a modal/drawer.
- **Checklist**:
  - [ ] Uses Merlion components.

### 2. `frontend/src/app/api/bookings/route.ts` (Create)
- **Purpose**: BFF proxy.
- **Checklist**:
  - [ ] Forwards to Laravel.

## Validation Criteria
- [ ] Migration runs.
- [ ] Can view events JSON via API.
- [ ] Can create a booking via API (increments booked_count).
- [ ] Overbooking returns 422 error.
