# API Documentation

The Civifix API is a RESTful API built on FastAPI. It communicates exclusively via JSON.

## Base URL
*   **Local Development**: `http://localhost:8000/api/v1`
*   **Interactive Docs (Swagger UI)**: `http://localhost:8000/docs`
*   **Redoc**: `http://localhost:8000/redoc`

---

## 1. Authentication Endpoints

### Register User
*   **URL**: `/auth/register`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "name": "Test User",
      "email": "user@gmail.com",
      "mobile_number": "9876543210",
      "address": "Chennai",
      "district": "Chennai",
      "constituency_id": "60c72b2f9b1d8b2e88a0bc7b"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Registration successful. OTP sent to email.",
      "data": {
        "user_id": "60c72b2f9b1d8b2e88a0bc7c",
        "message": "Please verify OTP to complete registration"
      }
    }
    ```

### Verify Registration OTP
*   **URL**: `/auth/verify-otp`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "email": "user@gmail.com",
      "otp": "123456"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Account verified and activated successfully.",
      "data": null
    }
    ```

### Login (Request OTP)
*   **URL**: `/auth/login`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "email": "user@gmail.com"
    }
    ```

### Verify Login OTP (Obtain Token)
*   **URL**: `/auth/verify-login-otp`
*   **Method**: `POST`
*   **Payload**:
    ```json
    {
      "email": "user@gmail.com",
      "otp": "123456"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsIn...",
        "token_type": "bearer",
        "user": {
          "id": "60c72b2f9b1d8b2e88a0bc7c",
          "name": "Test User",
          "email": "user@gmail.com",
          "role": "CITIZEN",
          "district": "Chennai"
        }
      }
    }
    ```

---

## 2. Complaint Management

### Create Complaint (Citizen Only)
*   **URL**: `/complaints`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer <access_token>`
*   **Payload**:
    ```json
    {
      "ward_id": "60c72b2f9b1d8b2e88a0bc7a",
      "complaint_type": "GARBAGE",
      "description": "Garbage has piled up near the market and smells bad.",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "landmark": "Opposite Market Gate",
      "image_urls": []
    }
    ```

### Assign Worker (Inspector Only)
*   **URL**: `/complaints/{complaint_id}/assign`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer <access_token>`
*   **Payload**:
    ```json
    {
      "worker_id": "60c72b2f9b1d8b2e88a0bc7d",
      "deadline": "2026-08-09T12:00:00Z"
    }
    ```

### Resolve Complaint (Worker Only)
*   **URL**: `/worker/complaints/{complaint_id}/resolve`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer <access_token>`
*   **Payload**:
    ```json
    {
      "resolution_note": "Garbage has been cleared and area sanitized.",
      "resolved_images": ["https://assets.civifix.in/res.jpg"]
    }
    ```

---

## 3. Administrative Operations

### Create Internal Users (Admin Only)
*   **URL**: `/admin/users`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer <access_token>`
*   **Payload**:
    ```json
    {
      "name": "Inspector Shakthi",
      "email": "shakthi@civifix.in",
      "mobile_number": "9876543220",
      "role": "INSPECTOR",
      "district": "Chennai",
      "address": "Chennai Zone Office"
    }
    ```
