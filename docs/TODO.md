# Code Review and TODO List

This document logs code smells, deprecated patterns, duplicated logic, and optimization opportunities identified during analysis.

## 1. Resolved Bugs & Fixes (Completed)

*   **Fixed** - `test_create_complaint_success`: The test suite was raising validation errors due to the missing required `landmark` parameter in `ComplaintCreateSchema` instantiations. Added `landmark="Near Market"` to all test schema constructs.
*   **Fixed** - `test_register_user` & `test_register_duplicate_email`: Resolved test failures caused by connection errors to MongoDB when looking up constituencies. Mocked the database and constituency collection responses in `test_auth.py` so tests run successfully offline.
*   **Fixed** - `TestSpamDetection` limits: Added dynamic patches for `MAX_COMPLAINTS_PER_WEEK` and `MAX_COMPLAINTS_PER_DAY` in `test_complaints.py` so limits check tests pass without modifying production business logic thresholds.
*   **Fixed** - `test_assign_worker_success`: Aligned mocked worker district ID and complaint district ID so the alignment validation checks pass cleanly.
*   **Fixed** - `ComplaintValidator.validate_description`: Changed return expression to return an explicit boolean instead of an empty string when the parameter is empty, resolving `AssertionError` checks.
*   **Fixed** - Signup UI field removal: Removed `Assembly Constituency` and `Ward` dropdowns from the web and mobile signup forms at the user's request. Configured the frontends to automatically fetch and select the first constituency/ward of the chosen district behind the scenes to preserve backend database integrity.

---

## 2. Identified Code Smells & Deprecations

*   **Pydantic v1-style Validators**:
    *   Files: `app/schemas/complaint_schema.py:80` and `app/schemas/auth_schema.py:38` use `@validator` instead of Pydantic v2's `@field_validator`.
    *   *Correction*: Refactor to use `@field_validator`.
*   **Deprecated `datetime.utcnow()`**:
    *   Multiple files in `Backend` call `datetime.utcnow()`.
    *   *Correction*: Update to timezone-aware UTC representation: `datetime.now(datetime.UTC)`.
*   **Deprecated `on_event` startup hooks**:
    *   File: `app/main.py:207` utilizes `@app.on_event("startup")` and `"shutdown"`.
    *   *Correction*: Refactor to use modern FastAPI `lifespan` event handlers.
*   **HTML `<img>` elements in Next.js**:
    *   Files: `civifix-web/src/app/signup/page.tsx:278`, `civifix-web/src/app/splash/page.tsx:21` (and others) use standard `<img>` tags.
    *   *Correction*: Replace with Next.js optimized `<Image />` component.

---

## 3. Duplicated Code

*   **ID Normalization**:
    *   Slightly different versions of MongoDB Object ID parsing and string normalization exist in `app/services/complaint_service.py` and `app/dependencies/auth_dependency.py`.
    *   *Correction*: Consolidate database utility parsing routines into `app/utils/helpers.py`.
*   **Address Deduplication**:
    *   The address parser routine in `civifix-web/src/app/(dashboard)/complaints/create/page.tsx` is duplicated in other pages.
    *   *Correction*: Extract to a shared frontend utility file `/src/utils/address.ts`.

---

## 4. Optimization Opportunities

*   **Caching Layer**:
    *   Implement **Redis** caching for static lists that change rarely (Districts, Wards, Constituencies) to reduce DB lookup latency.
*   **Rate Limiting**:
    *   Use redis-based sliding window rate-limit middleware instead of app-level checks.
