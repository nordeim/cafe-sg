# Phase 10 Implementation Plan: Newsletter, Consent, and Transactional Messaging

## Phase 10.1: Backend Newsletter & Consent

### 1. `backend/database/migrations/xxxx_xx_xx_create_newsletter_tables.php` (Create)
- **Purpose**: Store subscribers with explicit consent tracking (PDPA compliance).
- **Content**:
  - Table `newsletter_subscribers`:
    - `id` (UUID)
    - `email` (string, unique)
    - `consent_granted_at` (timestamp)
    - `consent_source` (string, e.g., 'web_footer')
    - `unsubscribed_at` (timestamp, nullable)
- **Checklist**:
  - [ ] Unique index on email.
  - [ ] Non-nullable consent timestamp.

### 2. `backend/app/Models/NewsletterSubscriber.php` (Create)
- **Purpose**: Eloquent model for subscribers.
- **Checklist**:
  - [ ] `HasUuids` trait applied.
  - [ ] `$fillable` includes email and consent fields.

### 3. `backend/app/Http/Controllers/NewsletterController.php` (Create)
- **Purpose**: API endpoint for subscription.
- **Content**:
  - `subscribe(Request $request)`:
    - Validates `email` and `consent_marketing` (boolean).
    - Rejects if `consent_marketing` is false.
    - Uses `updateOrCreate` to handle resubscriptions.
- **Checklist**:
  - [ ] Returns 201 on success.
  - [ ] Returns 422 if consent is missing.

### 4. `backend/routes/api.php` (Update)
- **Purpose**: Register the newsletter route.
- **Content**:
  - `POST /newsletter/subscribe` -> `NewsletterController@subscribe`.
- **Checklist**:
  - [ ] Route is versioned under `v1`.

## Phase 10.2: Transactional Messaging

### 1. `backend/app/Services/MailService.php` (Create)
- **Purpose**: Centralized service for sending brand-aligned emails.
- **Content**:
  - Wrapper around Laravel's `Mail` facade.
  - Method `sendWelcome(string $email)`: Sends the welcome discount code mentioned in `cafe.html`.
- **Checklist**:
  - [ ] Uses standard Laravel Mailable classes.
  - [ ] Logs email attempts for audit.

## Phase 10.3: Frontend Newsletter Integration

### 1. `frontend/src/components/merlion/newsletter-form.tsx` (Create)
- **Purpose**: The "Join Our Manuscript" form from `cafe.html`.
- **Content**:
  - Email input.
  - Explicit consent checkbox (unchecked by default).
  - Success/Error toast messages.
- **Checklist**:
  - [ ] Typography and button style match `cafe.html`.
  - [ ] Checkbox is required for submission.

### 2. `frontend/src/app/api/newsletter/route.ts` (Create)
- **Purpose**: BFF route proxy.
- **Content**:
  - `POST` handler forwarding to Laravel.
- **Checklist**:
  - [ ] Proxies status codes correctly.

## Validation Criteria
- [ ] `php artisan migrate` creates the subscription table.
- [ ] Submitting the newsletter form with consent adds a record to the database.
- [ ] Submitting without the consent checkbox results in a frontend validation error.
- [ ] Transactional emails are logged in `laravel.log` (using `log` mail driver).
