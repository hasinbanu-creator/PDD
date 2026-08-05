import asyncio
import os
import sys
from dotenv import load_dotenv

# Load env variables
load_dotenv()

from app.ai.image_verification import verify_complaint_image
from app.core.config import settings

async def main():
    print("Testing Image Verification Service...")
    # Minimum valid JPEG bytes (1x1 pixel)
    dummy_image = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.' \",#\x1c\x1c(7),01444\x1f'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00?\x00\x37\x00\x0f\xff\xd9"
    
    # 1. Test with BLOCK_UNRELATED_CIVIC_ISSUES = False (default)
    settings.BLOCK_UNRELATED_CIVIC_ISSUES = False
    print(f"BLOCK_UNRELATED_CIVIC_ISSUES set to: {settings.BLOCK_UNRELATED_CIVIC_ISSUES}")
    
    res1 = await verify_complaint_image(dummy_image, "image/jpeg")
    print("Test 1 Result:", res1)
    
    # 2. Test with BLOCK_UNRELATED_CIVIC_ISSUES = True
    settings.BLOCK_UNRELATED_CIVIC_ISSUES = True
    print(f"BLOCK_UNRELATED_CIVIC_ISSUES set to: {settings.BLOCK_UNRELATED_CIVIC_ISSUES}")
    
    res2 = await verify_complaint_image(dummy_image, "image/jpeg")
    print("Test 2 Result:", res2)

if __name__ == "__main__":
    asyncio.run(main())

