#!/usr/bin/env python3
"""Train the CiviFix local image classification model.

This script loads the dataset from Backend/ai/vision/dataset/,
verifies that exactly the 7 expected classes are present,
maps them to the correct index order, fine-tunes a local ResNet-18 model,
and evaluates the performance on the test set.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
import numpy as np
import torch
from datasets import load_dataset
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from transformers import (
    AutoImageProcessor,
    AutoModelForImageClassification,
    Trainer,
    TrainingArguments,
)

CLASS_NAMES = [
    "garbage_waste",
    "road_damage",
    "pothole",
    "street_light",
    "drainage_issue",
    "road_waterlogging",
    "construction_block",
]

CLASS_TO_IDX = {name: i for i, name in enumerate(CLASS_NAMES)}

DATASET_ROOT = Path(__file__).resolve().parent / "dataset"
MODEL_SAVE_PATH = Path(__file__).resolve().parent / "model" / "civifix_classifier"


def verify_dataset_structure(hf_classes: list[str]) -> None:
    print("Verifying dataset structure...")
    
    # Check for unwanted classes
    unwanted = {"other_issue", "water_supply", "sanitation", "tree_fallen_branch"}
    for class_name in hf_classes:
        if class_name in unwanted:
            raise ValueError(f"Unwanted class '{class_name}' found in dataset directories!")
            
    # Check if all 7 expected classes are present
    missing = [c for c in CLASS_NAMES if c not in hf_classes]
    if missing:
        raise ValueError(f"Missing expected classes in dataset: {missing}")

    print("Verification successful. All expected 7 classes are present, and no unwanted classes were found.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train CiviFix Local Image Classifier")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size for training and eval")
    args = parser.parse_args()

    print(f"Loading dataset from: {DATASET_ROOT}")
    if not DATASET_ROOT.exists():
        print(f"Error: Dataset directory {DATASET_ROOT} does not exist.")
        sys.exit(1)

    raw_dataset = load_dataset("imagefolder", data_dir=str(DATASET_ROOT))
    hf_classes = raw_dataset["train"].features["label"].names
    
    # Verify classes
    verify_dataset_structure(hf_classes)

    # Remap label indices to match the desired class index mapping
    hf_idx_to_our_idx = {i: CLASS_TO_IDX[name] for i, name in enumerate(hf_classes)}
    
    def remap_labels(batch):
        batch["label"] = [hf_idx_to_our_idx[l] for l in batch["label"]]
        return batch

    print("Remapping class indices to match target CiviFix schema...")
    mapped_dataset = raw_dataset.map(remap_labels, batched=True)

    # Load ResNet-18 image processor
    print("Initializing ResNet-18 image processor...")
    image_processor = AutoImageProcessor.from_pretrained("microsoft/resnet-18")

    def transform_images(examples):
        inputs = image_processor([x.convert("RGB") for x in examples["image"]], return_tensors="pt")
        inputs["labels"] = examples["label"]
        return inputs

    mapped_dataset = mapped_dataset.with_transform(transform_images)

    # Load ResNet-18 model
    print("Initializing ResNet-18 model for classification...")
    model = AutoModelForImageClassification.from_pretrained(
        "microsoft/resnet-18",
        num_labels=len(CLASS_NAMES),
        id2label={str(i): name for i, name in enumerate(CLASS_NAMES)},
        label2id={name: i for i, name in enumerate(CLASS_NAMES)},
        ignore_mismatched_sizes=True,
    )

    # Define training arguments
    results_dir = Path(__file__).resolve().parent / "results"
    logs_dir = Path(__file__).resolve().parent / "logs"
    
    # Device setup
    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Training will run on device: {device}")

    training_args = TrainingArguments(
        output_dir=str(results_dir),
        eval_strategy="epoch",
        save_strategy="epoch",
        learning_rate=5e-5,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        num_train_epochs=args.epochs,
        weight_decay=0.01,
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        logging_steps=10,
        remove_unused_columns=False,
        use_cpu=(device == "cpu"),
    )

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=1)
        acc = accuracy_score(labels, preds)
        return {"accuracy": acc}

    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=mapped_dataset["train"],
        eval_dataset=mapped_dataset["validation"],
        processing_class=image_processor,
        compute_metrics=compute_metrics,
    )

    # Train model
    print("Starting training...")
    trainer.train()
    print("Training finished.")

    # Save best model
    print(f"Saving best model to: {MODEL_SAVE_PATH}")
    MODEL_SAVE_PATH.mkdir(parents=True, exist_ok=True)
    trainer.save_model(str(MODEL_SAVE_PATH))
    image_processor.save_pretrained(str(MODEL_SAVE_PATH))
    print("Model saved successfully.")

    # Evaluate on TEST set
    print("\nEvaluating on TEST set...")
    test_results = trainer.predict(mapped_dataset["test"])
    logits = test_results.predictions
    all_preds = np.argmax(logits, axis=1)
    all_labels = test_results.label_ids
            
    # Calculate metrics
    accuracy = accuracy_score(all_labels, all_preds)
    print(f"\nOverall Test Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    report = classification_report(
        all_labels,
        all_preds,
        target_names=CLASS_NAMES,
        zero_division=0,
    )
    print(report)
    
    print("\nConfusion Matrix:")
    matrix = confusion_matrix(all_labels, all_preds)
    print(matrix)
    
    # Per-class accuracy calculation
    print("\nPer-class Accuracy:")
    for i, class_name in enumerate(CLASS_NAMES):
        class_mask = (np.array(all_labels) == i)
        if np.sum(class_mask) > 0:
            class_acc = np.sum((np.array(all_preds) == i) & class_mask) / np.sum(class_mask)
            print(f"  {class_name:<20}: {class_acc:.4f} (count: {np.sum(class_mask)})")
        else:
            print(f"  {class_name:<20}: No test samples")


if __name__ == "__main__":
    main()
