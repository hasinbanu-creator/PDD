import re

with open("Backend/app/api/v1/inspector_routes.py", "r") as f:
    content = f.read()

# Add Form, UploadFile, File to imports if needed
if "from fastapi import APIRouter, Depends, status, HTTPException, Query, Form, UploadFile, File" not in content:
    content = content.replace(
        "from fastapi import APIRouter, Depends, status, HTTPException, Query",
        "from fastapi import APIRouter, Depends, status, HTTPException, Query, Form, UploadFile, File"
    )

if "import os" not in content:
    content = content.replace("import logging", "import logging\nimport os\nimport uuid\nimport aiofiles")

resolve_old = """class ResolveComplaintRequest(BaseModel):
    proof_images: List[str]
    note: Optional[str] = None

@router.put(
    "/complaints/{complaint_id}/resolve",
    summary="Resolve a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def resolve_complaint(
    complaint_id: str,
    payload: ResolveComplaintRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    \"\"\"Move complaint to RESOLVED with proof images\"\"\"
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if not payload.proof_images or len(payload.proof_images) == 0:
            return ResponseHandler.error(
                message="Resolution proof images are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": {
                "status": "RESOLVED",
                "proof_images": payload.proof_images,
                "closed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "STATUS_CHANGED",
            "old_status": complaint.get("status"),
            "new_status": "RESOLVED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": payload.note or "Issue verified and resolved by inspector",
            "timestamp": datetime.utcnow()
        })"""

resolve_new = """@router.put(
    "/complaints/{complaint_id}/resolve",
    summary="Resolve a complaint",
    dependencies=[Depends(require_role("INSPECTOR"))]
)
async def resolve_complaint(
    complaint_id: str,
    note: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    \"\"\"Move complaint to RESOLVED with proof images\"\"\"
    try:
        complaint = await _find_complaint_by_identifier(complaint_id)
        if not complaint:
            return ResponseHandler.error(
                message="Complaint not found",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if not images or len(images) == 0:
            return ResponseHandler.error(
                message="Resolution proof images are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user_id = str(current_user["user_id"])
        image_urls = []
        upload_dir = os.path.join("uploads", user_id, "images")
        os.makedirs(upload_dir, exist_ok=True)
        
        for file in images:
            if not file.filename:
                continue
            file_uuid = uuid.uuid4().hex[:8]
            new_filename = f"resolve_{file_uuid}.jpg"
            file_path = os.path.join(upload_dir, new_filename)
            
            content_bytes = await file.read()
            async with aiofiles.open(file_path, 'wb') as out_file:
                await out_file.write(content_bytes)
            image_urls.append(f"{user_id}/images/{new_filename}")

        if len(image_urls) == 0:
            return ResponseHandler.error(
                message="Valid resolution proof images are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        await db.complaints.update_one(
            {"_id": complaint.get("_id")},
            {"$set": {
                "status": "RESOLVED",
                "proof_images": image_urls,
                "closed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )

        await db.complaint_history.insert_one({
            "complaint_id": complaint.get("_id"),
            "action": "STATUS_CHANGED",
            "old_status": complaint.get("status"),
            "new_status": "RESOLVED",
            "performed_by": ObjectId(current_user["user_id"]),
            "role": "INSPECTOR",
            "remarks": note or "Issue verified and resolved by inspector",
            "timestamp": datetime.utcnow()
        })"""

content = content.replace(resolve_old, resolve_new)

with open("Backend/app/api/v1/inspector_routes.py", "w") as f:
    f.write(content)
