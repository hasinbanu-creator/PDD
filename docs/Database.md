# Database Documentation

Civifix uses **MongoDB** as its primary storage database. The backend communicates with MongoDB asynchronously using the `motor` driver.

## Collections & Document Schemas

### 1. `users`
Stores user profile information, role status, and verification state.
*   **Key Fields**:
    *   `name`: `str`
    *   `email`: `str` (indexed, unique)
    *   `mobile_number`: `str` (indexed, unique)
    *   `role`: `str` (default: `"CITIZEN"`)
    *   `district`: `str`
    *   `constituency_id`: `ObjectId` / `str`
    *   `is_verified`: `bool`
    *   `is_active`: `bool`
    *   `otp_code_hash`: `str` (hashed temporary OTP code)
    *   `otp_expiry`: `datetime`

### 2. `complaints`
Stores complaints raised by citizens, statuses, location pins, and assignments.
*   **Key Fields**:
    *   `complaint_id`: `str` (Auto-generated unique human-friendly ID, e.g., `CIVI-20260802-1A3F`)
    *   `citizen_id`: `ObjectId`
    *   `ward_id`: `ObjectId`
    *   `district_id`: `ObjectId`
    *   `complaint_type`: `str` (enum: `"GARBAGE"`, `"ROAD_DAMAGE"`, etc.)
    *   `description`: `str`
    *   `latitude`: `float`, `longitude`: `float`
    *   `landmark`: `str`
    *   `status`: `str` (enum: `"OPEN"`, `"ASSIGNED"`, `"WORKING"`, `"RESOLVED"`, `"CLOSED"`, `"REJECTED"`)
    *   `inspector_id`: `ObjectId` (optional)
    *   `worker_id`: `ObjectId` (optional)
    *   `resolution_note`: `str` (optional)
    *   `image_urls`: `list[str]`

### 3. `wards`
Defines operational wards under districts, along with supervisor mappings.
*   **Key Fields**:
    *   `district_id`: `ObjectId`
    *   `ward_name`: `str`
    *   `ward_number`: `str`
    *   `inspector_id`: `ObjectId`
    *   `is_active`: `bool`
    *   `complaint_counts`: `dict` (tracking open/closed aggregates)

### 4. `districts`
Stores district metadata.
*   **Key Fields**:
    *   `name`: `str` (unique)
    *   `state`: `str` (default: `"Tamil Nadu"`)

### 5. `constituencies`
Stores assembly constituencies.
*   **Key Fields**:
    *   `name`: `str`
    *   `district_id`: `ObjectId`

### 6. `roles`
Stores role permissions definitions for RBAC.
*   **Key Fields**:
    *   `name`: `str` (unique, e.g., `"INSPECTOR"`)
    *   `permissions`: `list[str]`

---

## Indexing Strategy

To maintain high query performance, the following indices are created programmatically on startup:

1.  **Users**:
    *   `email` (Unique Index)
    *   `mobile_number` (Unique Index)
    *   `role` (Single Index)
2.  **Complaints**:
    *   `complaint_id` (Unique Index)
    *   `citizen_id` (Single Index)
    *   `district_id` (Single Index)
    *   `status` (Single Index)
    *   `location` (2dsphere Geospatial Index for spatial queries and duplicate detection)
3.  **Wards**:
    *   `district_id` + `ward_number` (Compound Unique Index)
    *   `inspector_id` (Single Index)
