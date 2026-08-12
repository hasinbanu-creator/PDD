#!/usr/bin/env python3
"""Run inference on a single image using the trained CiviFix local vision model."""

import argparse
import sys
from pathlib import Path
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

CLASS_NAMES = [
    "garbage_waste",
    "road_damage",
    "pothole",
    "street_light",
    "drainage_issue",
    "road_waterlogging",
    "construction_block",
]

MODEL_PATH = Path(__file__).resolve().parent / "model" / "civifix_classifier"


def main() -> None:
    parser = argparse.ArgumentParser(description="Inference with CiviFix Local Vision Model")
    parser.add_argument("image_path", type=str, help="Path to the image file to classify")
    args = parser.parse_args()

    image_path = Path(args.image_path)
    if not image_path.exists():
        print(f"Error: Image file {image_path} does not exist.")
        sys.exit(1)

    if not MODEL_PATH.exists():
        print(f"Error: Model directory {MODEL_PATH} does not exist. Please train the model first.")
        sys.exit(1)

    print("Loading image...")
    try:
        image = Image.open(image_path).convert("RGB")
    except Exception as e:
        print(f"Error: Failed to open image: {e}")
        sys.exit(1)

    print("Loading model and processor...")
    try:
        processor = AutoImageProcessor.from_pretrained(str(MODEL_PATH))
        model = AutoModelForImageClassification.from_pretrained(str(MODEL_PATH))
    except Exception as e:
        print(f"Error: Failed to load model: {e}")
        sys.exit(1)

    print("Running prediction...")
    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    model.to(device)
    model.eval()

    # Preprocess image
    inputs = processor(image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence, pred_idx = torch.max(probs, dim=1)
        pred_idx = pred_idx.item()
        confidence = confidence.item()

    predicted_class = CLASS_NAMES[pred_idx]
    
    print("\n--- Prediction Result ---")
    print(f"Image: {image_path.name}")
    print(f"Predicted Class: {predicted_class} (Index {pred_idx})")
    print(f"Confidence Score: {confidence:.4f}")
    print("-------------------------")


if __name__ == "__main__":
    main()
