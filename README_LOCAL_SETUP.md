# Local Setup Instructions

This document provides step-by-step instructions for running the Civifix platform locally.

## Prerequisites

Ensure you have the following installed on your developer machine:
1.  **Node.js**: v18.0.0+ (Tested on v22+)
2.  **Python**: v3.10+ (Tested on v3.12.5)
3.  **MongoDB**: v5.0+ (Local service or via Docker)

---

## 1. Database Setup

Ensure MongoDB is running locally on port `27017`. You can run MongoDB inside a Docker container:
```bash
docker run -d -p 27017:27017 --name local-mongo mongo:latest
```

---

## 2. Backend Setup & Run

1.  Navigate into the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv .venv
    ```
3.  Activate the virtual environment:
    *   **Windows**:
        ```powershell
        .venv\Scripts\activate
        ```
    *   **Mac/Linux**:
        ```bash
        source .venv/bin/activate
        ```
4.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Create a `.env` file from the following template:
    ```env
    ENV=development
    LOG_LEVEL=INFO
    MONGODB_URL=mongodb://localhost:27017
    DATABASE_NAME=civifix_db
    JWT_SECRET_KEY=local-dev-jwt-secret-key-123456789
    JWT_REFRESH_SECRET=local-dev-jwt-refresh-secret-key-123456789
    ```
6.  Seed default data (Districts and Wards) if required:
    ```bash
    python -m app.db.seed_constituencies
    ```
7.  Run the FastAPI backend:
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    *API documentation will be available at: http://localhost:8000/docs*

---

## 3. Web Frontend Setup & Run

1.  Navigate to `civifix-web`:
    ```bash
    cd civifix-web
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Create a `.env.local` configuration file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    ```
4.  Run in development mode:
    ```bash
    npm run dev
    ```
    *Web app will be available at: http://localhost:3000*

---

## 4. Mobile Frontend Setup & Run

1.  Navigate to `civifix-frontend`:
    ```bash
    cd civifix-frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Create a `.env` file:
    ```env
    EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
    ```
4.  Start the Expo development server:
    ```bash
    npx expo start
    ```
    *Scan the QR code in your Expo Go app on iOS/Android to load the application.*

---

## Troubleshooting

### 1. Connection Failure to MongoDB
*   Ensure MongoDB service is running: `docker ps` or check Windows services.
*   Verify your `MONGODB_URL` in `Backend/.env` matches your MongoDB host/port.

### 2. Validation Errors on Signup
*   Ensure that you have seeded constituencies and districts.
*   If selecting a district does not show wards, verify that the seeding script completed successfully.
