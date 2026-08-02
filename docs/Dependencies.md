# Dependencies Documentation

This document lists the runtime engines, package lists, configurations, and build tools for each module.

## 1. System-Wide Runtime & Build Requirements

*   **Node.js**: v18.0.0+ (Tested on v22+)
*   **npm**: v9.0.0+ (Tested on v11.14.1)
*   **Python**: v3.10+ (Tested on v3.12.5)
*   **Java SDK**: v21+ (For automation test suite)
*   **Docker & Docker Compose**: (Optional, for containerized MongoDB and API)

---

## 2. Backend Dependencies (Python)
Managed via `Backend/requirements.txt` and installed inside virtual environment:

*   **Web Framework & Core**:
    *   `fastapi==0.104.1`: Web API framework.
    *   `uvicorn==0.24.0`: ASGI server.
    *   `pydantic==2.5.0`: Data validation and settings management.
    *   `pydantic-settings==2.1.0`: Settings management from environment.
*   **Database & Driver**:
    *   `pymongo==4.6.0`: Synchronous MongoDB driver.
    *   `motor==3.3.2`: Asynchronous MongoDB driver.
*   **Security & Auth**:
    *   `bcrypt==4.0.1`: Password/OTP hashing.
    *   `python-jose==3.3.0`: JWT encoding and decoding.
    *   `python-multipart==0.0.32`: Multipart/form-data request parsing.
*   **Testing**:
    *   `pytest==7.4.3` & `pytest-asyncio==0.21.1`: Async unit tests.
    *   `httpx==0.25.2`: Client for calling FastAPI test routes.
*   **Mailing**:
    *   `aiosmtplib==5.1.0` & `email-validator==2.1.0`: Async email verification.

---

## 3. Web Frontend Dependencies (Node.js)
Managed via `civifix-web/package.json`:

*   **Core**:
    *   `next`: v15.5.19 (React 19.1.0 / React DOM 19.1.0)
*   **State Management & Networking**:
    *   `@tanstack/react-query`: v5.101.0 (API data fetching/caching)
    *   `axios`: v1.17.0 (API HTTP requests)
*   **Styling & UI**:
    *   `tailwindcss`: v4 (Utility styling)
    *   `lucide-react`: v1.17.0 (Icons)
    *   `shadcn`: v4.11.0 & `@base-ui/react`: v1.5.0 (UI primitives)
*   **Testing**:
    *   `selenium-webdriver` (v4.44.0), `mocha` (v11.7.6), `chai` (v6.2.2)

---

## 4. Mobile Frontend Dependencies (Node.js)
Managed via `civifix-frontend/package.json`:

*   **Core**:
    *   `react`: v19.1.0
    *   `react-native`: v0.81.5
*   **Navigation**:
    *   `@react-navigation/native` (v6.1.0), `@react-navigation/stack` (v6.3.0), `@react-navigation/bottom-tabs` (v6.5.0)
*   **Styling**:
    *   `tailwindcss` (v3.3.0) & `nativewind` (v2.0.0)
*   **Device APIs**:
    *   `react-native-maps` (v1.20.1) & `react-native-geolocation-service` (v5.3.1)
    *   `react-native-image-picker` (v7.1.2)

---

## 5. Java Automation Dependencies (Java / Maven)
Managed via `civifix-java-automation/pom.xml`:

*   `selenium-java` (v4.21.0): Browser automation.
*   `testng` (v7.10.2): Test orchestration.
*   `webdrivermanager` (v5.8.0): Auto-manage driver binaries.
*   `extentreports` (v5.1.1): HTML test report generation.
*   `poi` & `poi-ooxml` (v5.2.5): Excel read/write utilities.
