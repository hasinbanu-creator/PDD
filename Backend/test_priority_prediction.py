import asyncio
import sys
import os

# Add Backend root directory to path to allow importing app module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai.priority_prediction import predict_complaint_priority

async def test_priority_prediction():
    print("Testing AI Priority Prediction Service...")
    
    # Test cases
    test_cases = [
        {
            "category": "Garbage",
            "district": "Kanchipuram",
            "ward": "Ward 12",
            "description": "Garbage has accumulated near the Government Primary School entrance for the last three days. Children are unable to walk through the area because of foul smell and insects."
        },
        {
            "category": "Pothole",
            "district": "Chennai",
            "ward": "Ward 4",
            "description": "Small pothole on the side of the minor residential street, cars can easily go around it."
        }
    ]

    for i, tc in enumerate(test_cases, 1):
        print(f"\n--- Running Test {i} ---")
        print(f"Category: {tc['category']}")
        print(f"District: {tc['district']}")
        print(f"Ward: {tc['ward']}")
        print(f"Description: {tc['description']}")
        
        result = await predict_complaint_priority(
            category=tc["category"],
            description=tc["description"],
            district=tc["district"],
            ward=tc["ward"]
        )
        print(f"Result: {result}")
        assert "priority" in result, "Result missing priority key"
        assert "confidence" in result, "Result missing confidence key"
        assert "reason" in result, "Result missing reason key"

if __name__ == "__main__":
    asyncio.run(test_priority_prediction())
