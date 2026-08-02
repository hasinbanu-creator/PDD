# Product Features Documentation

The Civifix platform provides dedicated workspaces and workflows tailored for citizens, field inspectors, workers, and system administrators.

## 1. Citizen Features
*   **OTP-verified Onboarding**: Citizens register with their mobile number, email, and assembly constituency. Verification is performed using a hashed 6-digit OTP sent to their email.
*   **Raise Complaints**: Citizens can report civic issues (garbage, pothole, streetlights, drainage, water supply, etc.) by uploading description details, landmarks, attaching coordinates (GPS latitude/longitude), and uploading photos.
*   **Track Complaints**: A personal list showing past submissions, status updates, timelines, and resolution comments.
*   **Duplicate and Spam Guard**: Under-the-hood safeguards:
    *   *Duplicate Detection*: If a complaint of the same type is raised within 10 meters of an open complaint, it is flagged as a duplicate to avoid redundant effort.
    *   *Rate Limiting*: Restricts citizens to a maximum of 50 complaints/week and 20 complaints/day to prevent abuse.
    *   *Repetitive Check*: Jaccard similarity index prevents submitting the same text description repeatedly.

---

## 2. Inspector Features
*   **District-Isolated Dashboard**: Inspectors log in and are presented with all complaints filed within their assigned district and ward. They cannot see or modify other districts' data.
*   **Verify Complaints**: Verify complaints, change priority levels (Low, Medium, High, Critical), or reject them (with rejection reasons).
*   **Assign Workers**: Search for active workers in the same district and assign them to a verified complaint, setting an explicit resolution deadline.

---

## 3. Worker Features
*   **Task List**: View assigned complaints requiring action, ordered by priority and resolution deadline.
*   **Status Lifecycle Updates**: Update complaint status to `"WORKING"` when starting work on a task.
*   **Submit Resolutions**: Resolve a task by submitting a completion note and uploading proof images.

---

## 4. Admin Features
*   **User Provisioning**: Super Admins and District Admins can create administrative accounts (District Admins, Inspectors, Workers) for specific regions.
*   **Suspend/Activate Accounts**: Freeze accounts of users violating guidelines or activate new staff.
*   **District and Constituency Setup**: Manage administrative areas, boundaries, and wards.
*   **Dashboard Analytics**: Core charts and statistics (complaint density by category, open vs. resolved ratios, average resolution speed).
