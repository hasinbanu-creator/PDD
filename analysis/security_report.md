# Security Assessment Report

This report documents the security posture, identified vulnerabilities, and recommended remediations for the Civifix platform.

## 1. Authentication Security

*   **OTP Hashing**: Verification OTP values are hashed before storage in MongoDB using `bcrypt` (using `SecurityUtils.hash_otp`), preventing database compromises from leaking plaintext credentials.
*   **JWT Integrity**: Authentication tokens are signed using the `HS256` HMAC algorithm. Secret keys must be configured via environment variables to prevent token spoofing.
*   **OTP Rate Limiting**: The system implements failed attempts counters (`otp_attempts`) and cooldown controls (`OTP_COOLDOWN_MINUTES`) to block brute-force guessing of active codes.

---

## 2. Authorization (RBAC & Isolation)

*   **Role Verifiers**: FastAPI dependencies (like `role_dependency.py`) intercept calls to verify roles prior to route execution.
*   **District Isolation**: Validates that administrators, inspectors, and workers only manipulate resources in their own district, preventing horizontal privilege escalation.

---

## 3. Vulnerabilities & Mitigations

*   **Vulnerability - hardcoded secrets**: Default secrets exist in the config class fallback definitions.
    *   *Remediation*: Enforce strictly configured `.env` variables in production deployment pipelines and fail startup if secrets are missing.
*   **Vulnerability - geolocation validation**: High dependency on coordinates provided by the client frontend.
    *   *Remediation*: Implement backend checks using geocoding APIs to verify that client-submitted GPS coordinates fall inside the boundaries of the associated ward/district.
