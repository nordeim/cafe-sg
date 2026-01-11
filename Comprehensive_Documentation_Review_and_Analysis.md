# Comprehensive Documentation Review & Analysis
## Merlion Brews — Pre-Implementation Audit

---

## Executive Summary

I've conducted a deep, multi-dimensional analysis of the provided documentation suite. The architecture demonstrates **genuine sophistication** in several areas—particularly the "Soul/Brain" separation, the two-phase inventory model, and the Singapore compliance awareness (GST/InvoiceNow/PayNow). However, I've identified **critical gaps**, **cross-document inconsistencies**, and **under-specified security patterns** that must be addressed before implementation.

**Overall Assessment**: The documentation is **85% production-ready**. The remaining 15% represents gaps that could cause significant rework or security vulnerabilities if not addressed now.

I'll provide the complete design system and component fidelity review once you share `cafe.html`.

---

## 1. Architecture Strengths (What's Working)

### 1.1 The "Soul/Brain" Separation is Architecturally Sound
The metaphor isn't just branding—it enforces a genuine separation of concerns:
- **Soul (Next.js BFF)**: Owns rendering, animation orchestration, and ephemeral UI state
- **Brain (Laravel)**: Owns domain logic, transactional integrity, and compliance

This prevents the common anti-pattern of leaking business logic into the frontend.

### 1.2 Two-Phase Inventory Model is Correct for High-Contention Scenarios
```
Reserve (TTL-based) → Confirm (Payment-verified) → Ledger (Audit trail)
```
This is the right pattern. Simple atomic decrements fail under concurrent load. The ledger audit trail satisfies both debugging needs and potential regulatory scrutiny.

### 1.3 Shadcn Wrapper Pattern ("Merlion Wrappers") is Elegant
The decision to wrap Shadcn primitives rather than fork them is architecturally correct:
- Maintains upstream accessibility updates
- Isolates bespoke styling in a single layer
- Enables visual regression testing against the wrapper, not the primitive

### 1.4 Tailwind v4 Layer Strategy Aligns with Modern CSS
The documented `@layer tokens, base, components, utilities, overrides` cascade order is correct for Tailwind v4. This prevents specificity wars and makes the "override" layer's supremacy explicit.

### 1.5 Compliance Awareness is Non-Negotiable and Present
- GST calculation methodology (9/109 backwards extraction) is correct
- InvoiceNow as MVP scope acknowledges the April 2026 deadline
- PayNow requirement via Stripe PaymentIntents is the correct integration path

---

## 2. Critical Issues Requiring Immediate Resolution

### 2.1 ⚠️ Cross-Document Inconsistencies

| Issue | Document A | Document B | Resolution Required |
|-------|-----------|-----------|---------------------|
| Browser Support | PAD: "Safari 16.4+, Chrome 111+, Firefox 128+" | GEMINI.md: "Safari 16.4+, Chrome 111+" (Firefox missing) | Standardize to PAD version |
| Stripe Integration | PAD §10.1: References `checkout.session.completed` | MEP/AGENT.md: Consistently uses PaymentIntents | **This is a conflict.** PaymentIntents with Payment Element does NOT trigger `checkout.session.completed`. It triggers `payment_intent.succeeded`. Fix PAD §10.1. |
| Status | AGENT.md: "Status: ACTIVE / COMPLETE" | README.md: All phases checked ✓ | This is impossible. If complete, status should be ARCHIVED. If active, phases shouldn't all be checked. |
| Date | All docs: "January 11, 2026" | Reality: Future date | Intentional placeholder or error? Clarify. |

**Recommendation**: Create a single `CONSTANTS.md` file that documents locked values (browser targets, framework versions, business registration numbers) and have all other docs reference it.

### 2.2 ⚠️ Security Model is Under-Specified

The documentation establishes that the BFF proxies requests to Laravel, but the authentication/authorization model has gaps:

**Gap 1: Public Storefront API Security**
```
POST /api/v1/reservations (create)
POST /api/v1/orders/draft
```
These are public endpoints. What prevents:
- Bot-driven reservation exhaustion attacks?
- Forged reservation IDs in checkout flow?

**Current MEP Statement** (Phase 7):
> "Stripe intent endpoint requires server-side authentication/authorization strategy (even if 'public MVP', document the placeholder)"

This isn't a placeholder—it's a security requirement. 

**Recommendation**: Add to MEP Phase 6:
```
#### 8) Rate Limiting & Bot Mitigation
- Reservations: Max 5 active per IP/session
- Failed checkout attempts: Exponential backoff
- Cart token: HMAC-signed session identifier
```

**Gap 2: Webhook Verification is Mentioned but Unspecified**
The MEP says "Verifies signature using raw request body" but doesn't specify:
- Which header contains the signature (`Stripe-Signature`)
- Tolerance window for timestamp validation
- Failure logging and alerting

**Recommendation**: Add explicit webhook middleware specification to Phase 7.

### 2.3 ⚠️ InvoiceNow Provider Resilience is Missing

**Current State**: Documents mention "provider API" repeatedly but provide no fallback strategy.

**Failure Scenarios Not Addressed**:
1. Provider API is down during invoice generation
2. Transmission succeeds but provider loses data
3. Provider rejects invoice format (schema validation failure)
4. Provider goes out of business

**Recommendation**: Add to MEP Phase 8:
```
#### 6) InvoiceNow Failure Handling
- **Primary Path**: Async job with exponential backoff (3 attempts)
- **Circuit Breaker**: After 5 consecutive failures, pause queue and alert
- **Manual Fallback**: Admin UI for "Export as UBL XML" for manual IRAS upload
- **Audit Requirement**: All transmission attempts logged with full payload hash
```

### 2.4 ⚠️ Cart Persistence Edge Cases Unspecified

**Current State**: Cart stored client-side with `reservation_id` and `expires_at`.

**Failure Scenarios Not Addressed**:
1. User clears browser storage mid-checkout
2. Reservation expires while user is on payment page
3. PayNow QR expires (1-hour limit) during slow payment

**MEP Phase 7 mentions**:
> "Handles 1-hour QR code expiration (refresh logic or timeout message)"

But "refresh logic or timeout message" isn't a specification. Which is it?

**Recommendation**: Specify in Phase 7:
```
#### PayNow Expiration Handling
- Display countdown timer in UI
- At T-5 minutes: Show warning modal
- At expiration: Invalidate PaymentIntent, show "Time expired" message
- User action: "Restart checkout" (creates new reservation if needed)
```

---

## 3. Architecture Gaps

### 3.1 Database Transaction Isolation Level Unspecified

**Current State**: MEP references `lockForUpdate` for inventory but doesn't specify PostgreSQL isolation level.

**Why This Matters**: `READ COMMITTED` (PostgreSQL default) can still have phantom reads in certain scenarios. For inventory, you likely need:
```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

**Recommendation**: Add to MEP Phase 2:
```
#### Transaction Strategy
- Inventory mutations: REPEATABLE READ isolation
- General queries: READ COMMITTED (default)
- Ledger writes: Always within same transaction as stock update
```

### 3.2 No Redis Eviction Policy Specified

**Current State**: Redis used for cache AND queues.

**Risk**: If Redis memory fills, queue jobs could be evicted before processing.

**Recommendation**: Add to MEP Phase 1 (`infra/docker-compose.yml`):
```yaml
redis:
  command: redis-server --maxmemory 256mb --maxmemory-policy noeviction
```
And document that production should use separate Redis instances for cache vs. queues.

### 3.3 No CORS Specification

**Current State**: Next.js BFF calls Laravel API. CORS not mentioned.

**Scenarios**:
- Local dev: Next.js on 3000, Laravel on 8000 = cross-origin
- Production: May or may not be same-origin depending on deployment

**Recommendation**: Add to MEP Phase 2:
```
#### 8) `backend/config/cors.php`
- **Purpose**: CORS configuration for BFF access
- **Interfaces**: 
  - Allowed origins: env-driven (CORS_ALLOWED_ORIGINS)
- **Checklist**:
  - Credentials mode supported for authenticated admin routes
  - Preflight caching configured (max-age: 7200)
```

### 3.4 No API Versioning Deprecation Strategy

**Current State**: API is versioned (`/api/v1/...`) but there's no strategy for:
- When v2 would be introduced
- How v1 deprecation would be communicated
- Header-based version negotiation vs. URL-based

**Recommendation**: Add ADR:
```
### ADR-006 — API Versioning Strategy
- **Decision**: URL-based versioning (/api/v1/, /api/v2/)
- **Deprecation**: Minimum 6-month notice via `Sunset` header
- **Breaking Changes**: Never in minor versions; always new major version
```

---

## 4. MEP Structural Improvements

### 4.1 Phase Dependency Mapping is Implicit

Each phase lists files but doesn't explicitly state which prior phases are prerequisites. This matters for parallel execution by agents.

**Recommendation**: Add to each phase header:
```
### Phase 6 — Cart + Inventory Reservation
**Prerequisites**: Phase 2 (Backend Skeleton), Phase 3 (Frontend Foundation)
**Parallelizable with**: Phase 5 (Storefront Pages)
```

### 4.2 Global Interfaces Contract (§15) Should Be Earlier

The API contract is buried at the end. This should be Phase 0.5 or at minimum prominently referenced in Phase 2.

**Why**: Agents should understand the contract BEFORE building implementations.

### 4.3 Missing: Error Response Schema Contract

Nowhere is the standard error response format defined.

**Recommendation**: Add to MEP §0.2:
```
#### Error Response Contract
All API errors return:
{
  "error": {
    "code": "INVENTORY_EXHAUSTED",
    "message": "Human readable message",
    "details": {} // Optional context
  }
}
HTTP Status Codes:
- 400: Validation failures
- 401: Authentication required
- 403: Authorization denied
- 404: Resource not found
- 409: Conflict (e.g., reservation expired)
- 422: Business rule violation
- 500: Internal error (log reference only, no stack trace)
```

---

## 5. Design System Pre-Assessment (Pending `cafe.html`)

Based on the documentation, I'm prepared to evaluate `cafe.html` against:

### 5.1 Token Extraction Completeness
- [ ] All colors (including RGB variants for alpha compositing)
- [ ] Typography scale (fluid clamp() values)
- [ ] Spacing scale
- [ ] Animation durations and easing curves
- [ ] Z-index layers
- [ ] Shadows (including the `folio-frame` specific shadow)

### 5.2 Component Fidelity Checklist
- [ ] `folio-frame` double-border + gold inset + hover lift
- [ ] Button hover underlay animation (the "spreading" effect)
- [ ] Peranakan corner ornaments (SVG path accuracy)
- [ ] Floating coffee bean animation
- [ ] Mobile nav focus trap and escape handling
- [ ] Zigzag section RTL flip logic
- [ ] Paper fiber texture overlay

### 5.3 Accessibility Audit Points
- [ ] Color contrast (WCAG AAA target per docs)
- [ ] Reduced motion media query respecting `prefers-reduced-motion`
- [ ] Focus visible states
- [ ] ARIA attributes on interactive components
- [ ] Skip link functionality

### 5.4 Performance Audit Points
- [ ] Are animations GPU-accelerated (transform/opacity only)?
- [ ] Are SVG ornaments optimized (no unnecessary paths)?
- [ ] Is the texture overlay truly pointer-events: none?
- [ ] Font loading strategy (display: swap?)

---

## 6. Recommendations Summary

### Immediate Actions (Before Implementation)

| Priority | Action | Owner | Phase Impact |
|----------|--------|-------|--------------|
| 🔴 Critical | Fix Stripe event type in PAD (payment_intent.succeeded, not checkout.session.completed) | Architecture | Phase 7 |
| 🔴 Critical | Define public API rate limiting and bot mitigation | Security | Phase 6 |
| 🔴 Critical | Specify InvoiceNow failure handling and manual fallback | Compliance | Phase 8 |
| 🟡 High | Add error response schema contract to MEP | API Design | Phase 2 |
| 🟡 High | Add database transaction isolation specification | Database | Phase 2 |
| 🟡 High | Add CORS configuration to MEP | Infrastructure | Phase 2 |
| 🟢 Medium | Create CONSTANTS.md for locked values | Documentation | Phase 0 |
| 🟢 Medium | Add phase dependency mapping | Documentation | All |
| 🟢 Medium | Add Redis eviction policy | Infrastructure | Phase 1 |

### Documentation Hygiene

1. **Resolve the status paradox**: If the project is in-progress, uncheck incomplete roadmap items
2. **Standardize dates**: Either use placeholder `[DATE]` or accurate dates
3. **Add changelog**: Track when major architectural decisions changed

---

## 7. Next Steps

Please provide `cafe.html` and I will:

1. **Extract and validate all design tokens** against the documented expectations
2. **Audit the CSS layer architecture** for Tailwind v4 compatibility
3. **Identify any component behaviors** not captured in current specifications
4. **Provide the complete Design Token Bridge specification** (`design-tokens/index.ts`)
5. **Flag any accessibility concerns** in the source HTML
6. **Assess animation performance** implications

This will complete the consolidated comprehensive review and position us to begin Phase 3 (Design Token Bridge) with full confidence.

---

