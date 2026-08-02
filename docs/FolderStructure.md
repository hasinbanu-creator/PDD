# Folder Structure Documentation

Civifix is structured as a monorepo containing the backend service, two frontend applications, and several automated testing suites.

## Root Directory Overview

```
.
├── Backend/                    # FastAPI python backend service
├── civifix-frontend/           # React Native Expo mobile application
├── civifix-web/                # Next.js web application
├── civifix-java-automation/    # Selenium Java TestNG E2E test suite
├── appium_tests/               # Appium mobile test scripts
├── selenium_tests/             # Node.js/Selenium web E2E test suite
├── security_tests/             # Vulnerability assessment and scanning scripts
├── load_tests/                 # Locust or custom load test scenarios
├── mobile_vulnerability_testing/ # Mobile security assessments
├── docs/                       # Project documentation folder
└── README.md                   # Project index file
```

---

## 1. Backend Folder Structure (`/Backend`)

The backend codebase follows a Modular/Layered Architecture:

```
Backend/
├── app/
│   ├── api/v1/                 # API controllers (routes)
│   │   ├── auth_routes.py      # Registration, login, OTP
│   │   ├── admin_routes.py     # User creation, suspension
│   │   ├── complaints_routes.py# Complaint CRUD, history
│   │   ├── inspector_routes.py # Inspector assignments
│   │   └── worker_routes.py    # Worker updates
│   ├── core/                   # Shared backend utilities
│   │   ├── config.py           # Pydantic Settings configuration
│   │   ├── security.py         # JWT tokens & OTP hashing
│   │   └── exceptions.py       # Custom exception handlers
│   ├── db/                     # DB client and index creation
│   ├── dependencies/           # FastAPI middleware/dependencies
│   ├── models/                 # MongoDB database document definitions
│   ├── repositories/           # DB access layers (UserRepository, etc.)
│   ├── schemas/                # Pydantic schema validation
│   ├── services/               # Main business logic layer
│   └── utils/                  # Validators, helpers
├── tests/                      # Pytest unit and integration tests
├── Dockerfile                  # Container definition
├── docker-compose.yml          # Local container environment definition
└── requirements.txt            # Python dependencies
```

---

## 2. Next.js Web Folder Structure (`/civifix-web`)

The Next.js web frontend is structured around the App Router system:

```
civifix-web/
├── src/
│   ├── app/                    # Next.js Pages & Layouts
│   │   ├── (auth)/             # Auth layouts (login, signup)
│   │   ├── (dashboard)/        # Main dashboard, complaints, profile
│   │   ├── layout.tsx          # Global HTML template
│   │   └── page.tsx            # Splash/Landing page
│   ├── components/             # Reusable UI elements (cards, forms)
│   ├── services/               # Axios API network layer
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Formatting and client helpers
├── public/                     # Static assets (images, logos)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript compiler config
└── package.json                # NPM packages and scripts
```

---

## 3. Mobile Folder Structure (`/civifix-frontend`)

The mobile application is a React Native app:

```
civifix-frontend/
├── src/
│   ├── screens/                # UI screens
│   │   ├── Auth/               # Login, Register, Verify screens
│   │   ├── Dashboard/          # Dashboard screen
│   │   └── Profile/            # Profile settings screen
│   ├── components/             # Custom buttons, cards, text fields
│   ├── services/               # Axios services for endpoints
│   ├── context/                # Global state (AuthContext)
│   ├── navigation/             # App navigation routing
│   └── constants/              # Styling theme configuration
├── App.js                      # React Native entry point
├── app.json                    # Expo config
└── package.json                # NPM packages and configurations
```

---

## 4. Test Suites Folder Structure

*   `/civifix-java-automation`: A Java project containing a Maven-based Selenium TestNG framework for automated web testing.
*   `/selenium_tests`: Node.js-based Selenium tests for running end-to-end integration scenarios.
*   `/appium_tests`: Appium integration tests for mobile app automation testing.
