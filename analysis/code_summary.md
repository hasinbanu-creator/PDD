# Code Summary Report

This report summarizes the source code directories, main modules, and line counts of the Civifix repository.

## 1. Directory Summary

| Directory | Scope | Language | File Count | Estimated LOC |
| :--- | :--- | :--- | :---: | :---: |
| `Backend` | FastAPI Service | Python | ~45 files | ~7,500 |
| `civifix-web` | Next.js Web Portal | TypeScript/CSS | ~100 files | ~13,000 |
| `civifix-frontend` | React Native App | JavaScript | ~40 files | ~8,000 |
| `civifix-java-automation`| E2E Selenium Tests| Java | ~15 files | ~2,500 |

Total estimated LOC: **80,358** (including test sheets and scrapers).

---

## 2. Core Python Code Breakdown

*   **API Routes (`app/api/v1/`)**: Exposes v1 endpoints. Handles routing for user management, complaints lifecycle, uploads, and constituencies.
*   **Services (`app/services/`)**: Enforces validation parameters, rate-limit thresholds, and manages entity assignments.
*   **Repositories (`app/repositories/`)**: Interfaces with MongoDB using `motor`. Handles database CRUD patterns.
*   **Models/Schemas (`app/models/` & `app/schemas/`)**: Declares database schemas and Pydantic input-output validators.

---

## 3. Core Frontend Code Breakdown

*   **Web Portal (`civifix-web/src`)**:
    *   `app/`: Implements modern client page routing using Next.js App Router.
    *   `services/`: Centralizes backend API requests via Axios.
    *   `context/`: Handles user session state and JWT storage.
*   **Mobile App (`civifix-frontend/src`)**:
    *   `screens/`: Renders Auth forms, Dashboard feed, and Profile settings.
    *   `navigation/`: Manages screen stack flows and bottom tabs.
    *   `context/`: Holds token authentication state.
