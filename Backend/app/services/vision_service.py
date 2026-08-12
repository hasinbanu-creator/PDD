import os
import logging
from pathlib import Path
from PIL import Image
import io
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

logger = logging.getLogger("app")

CLASS_NAMES = [
    "garbage_waste",
    "road_damage",
    "pothole",
    "street_light",
    "drainage_issue",
    "road_waterlogging",
    "construction_block",
]

# Configurable threshold in one place
CONFIDENCE_THRESHOLD = 0.70

class VisionService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(VisionService, cls).__new__(cls, *args, **kwargs)
            cls._instance.model = None
            cls._instance.processor = None
            cls._instance.device = None
        return cls._instance

    def load_model(self) -> None:
        """Loads the ResNet-18 model and processor if they are not already loaded."""
        if self.model is not None:
            return

        model_dir = Path(__file__).resolve().parent.parent.parent / "ai" / "vision" / "model" / "civifix_classifier"
        logger.info(f"Loading local ResNet-18 vision model from {model_dir}")
        try:
            if not model_dir.exists():
                raise FileNotFoundError(f"Model directory {model_dir} not found.")

            self.processor = AutoImageProcessor.from_pretrained(str(model_dir))
            self.model = AutoModelForImageClassification.from_pretrained(str(model_dir))
            self.device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
            self.model.to(self.device)
            self.model.eval()
            logger.info(f"Local ResNet-18 vision model successfully loaded on {self.device}.")
        except Exception as e:
            logger.error(f"Failed to load local ResNet-18 vision model: {e}")
            self.model = None
            self.processor = None
            self.device = None
            raise e

    def predict(self, image_bytes: bytes) -> dict:
        """Runs local inference on raw image bytes."""
        if self.model is None or self.processor is None:
            raise RuntimeError("Vision model is not loaded. Model loading failure.")

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            inputs = self.processor(image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = self.model(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=1)
                confidence, pred_idx = torch.max(probs, dim=1)
                pred_idx = pred_idx.item()
                confidence = confidence.item()

            predicted_class = CLASS_NAMES[pred_idx]
            logger.info(f"Local AI Vision predicted class: {predicted_class} (confidence: {confidence:.4f})")
            return {
                "predicted_class": predicted_class,
                "confidence": confidence
            }
        except Exception as e:
            logger.error(f"Error during local vision inference: {e}")
            raise e

    def normalize_category(self, category: str) -> str:
        if not category:
            return "other"
        cat = category.lower().strip().replace(" ", "_")
        mapping = {
            "garbage": "garbage_waste",
            "garbage_waste": "garbage_waste",
            "road_damage": "road_damage",
            "pothole": "pothole",
            "streetlight": "street_light",
            "street_light": "street_light",
            "drainage": "drainage_issue",
            "drainage_issue": "drainage_issue",
            "construction": "construction_block",
            "construction_block": "construction_block",
            "water_supply": "road_waterlogging",
            "road_waterlogging": "road_waterlogging",
        }
        return mapping.get(cat, cat)

    def verify_category_match(self, predicted_category: str, selected_category: str, confidence: float) -> dict:
        norm_pred = self.normalize_category(predicted_category)
        norm_sel = self.normalize_category(selected_category)
        
        logger.info(f"Comparing categories: selected_category='{selected_category}' (normalized='{norm_sel}') "
                    f"vs predicted_category='{predicted_category}' (normalized='{norm_pred}') with confidence={confidence:.4f}")
        
        if confidence >= CONFIDENCE_THRESHOLD:
            if norm_pred == norm_sel:
                return {
                    "verification_status": "MATCH",
                    "verified": True,
                    "selected_category": selected_category,
                    "predicted_category": predicted_category,
                    "confidence": confidence,
                    "verification_message": "Image matches the selected complaint category."
                }
            else:
                return {
                    "verification_status": "MISMATCH",
                    "verified": False,
                    "selected_category": selected_category,
                    "predicted_category": predicted_category,
                    "confidence": confidence,
                    "verification_message": "The uploaded image does not appear to match the selected complaint category."
                }
        else:
            return {
                "verification_status": "LOW_CONFIDENCE",
                "verified": False,
                "selected_category": selected_category,
                "predicted_category": predicted_category,
                "confidence": confidence,
                "verification_message": "The image could not be confidently verified. Please upload a clearer image."
            }

