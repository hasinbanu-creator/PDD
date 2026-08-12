#!/usr/bin/env python3
"""Prepare the CiviFix image dataset from raw class folders into train/validation/test splits.

This script does not train a model or modify the application workflow. It simply validates,
normalizes, and copies images into split directories for later local model work.
"""

from __future__ import annotations

import hashlib
import random
import shutil
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Tuple

from PIL import Image, UnidentifiedImageError

CLASS_NAMES = [
    "garbage_waste",
    "road_damage",
    "pothole",
    "street_light",
    "drainage_issue",
    "road_waterlogging",
    "construction_block",
]

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tif", ".tiff"}
SEED = 42

DATASET_ROOT = Path(__file__).resolve().parent / "dataset"
RAW_ROOT = DATASET_ROOT / "raw"
TRAIN_ROOT = DATASET_ROOT / "train"
VALIDATION_ROOT = DATASET_ROOT / "validation"
TEST_ROOT = DATASET_ROOT / "test"


def ensure_class_directories() -> None:
    for split_root in (RAW_ROOT, TRAIN_ROOT, VALIDATION_ROOT, TEST_ROOT):
        split_root.mkdir(parents=True, exist_ok=True)

    for class_name in CLASS_NAMES:
        (RAW_ROOT / class_name).mkdir(parents=True, exist_ok=True)
        (TRAIN_ROOT / class_name).mkdir(parents=True, exist_ok=True)
        (VALIDATION_ROOT / class_name).mkdir(parents=True, exist_ok=True)
        (TEST_ROOT / class_name).mkdir(parents=True, exist_ok=True)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_image(path: Path) -> None:
    with Image.open(path) as img:
        img.verify()

    with Image.open(path) as img:
        img.load()
        if img.size[0] <= 0 or img.size[1] <= 0:
            raise ValueError("Image has invalid dimensions.")


def list_candidate_files(class_dir: Path) -> List[Path]:
    if not class_dir.exists():
        return []

    files: List[Path] = []
    for path in sorted(class_dir.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(path)
    return files


def collect_valid_images() -> Tuple[Dict[str, List[Path]], List[Path], List[Path]]:
    valid_by_class: Dict[str, List[Path]] = {class_name: [] for class_name in CLASS_NAMES}
    corrupted: List[Path] = []
    duplicates: List[Path] = []
    seen_hashes: Dict[str, Path] = {}

    for class_name in CLASS_NAMES:
        for image_path in list_candidate_files(RAW_ROOT / class_name):
            file_hash = sha256_file(image_path)

            if file_hash in seen_hashes:
                duplicates.append(image_path)
                continue

            seen_hashes[file_hash] = image_path

            try:
                validate_image(image_path)
            except (OSError, ValueError, UnidentifiedImageError):
                corrupted.append(image_path)
                continue

            valid_by_class[class_name].append(image_path)

    return valid_by_class, corrupted, duplicates


def allocate_split_indices(total_count: int) -> Tuple[int, int, int]:
    if total_count <= 1:
        return total_count, 0, 0
    if total_count == 2:
        return 1, 0, 1
    if total_count == 3:
        return 2, 1, 0

    train_count = max(1, int(round(total_count * 0.8)))
    val_count = max(1, int(round(total_count * 0.1)))

    if train_count + val_count >= total_count:
        train_count = max(1, total_count - 2)
        val_count = max(1, total_count - train_count - 1)

    test_count = total_count - train_count - val_count
    if test_count < 0:
        test_count = 0

    if total_count >= 4 and test_count == 0:
        test_count = 1
        val_count = max(1, val_count - 1)
        if train_count + val_count + test_count > total_count:
            train_count = total_count - val_count - test_count

    return train_count, val_count, test_count


def split_class_images(image_paths: List[Path]) -> Dict[str, List[Path]]:
    if not image_paths:
        return {"train": [], "validation": [], "test": []}

    shuffled = image_paths[:]
    rng = random.Random(SEED)
    rng.shuffle(shuffled)

    train_count, val_count, test_count = allocate_split_indices(len(shuffled))
    train_images = shuffled[:train_count]
    val_images = shuffled[train_count : train_count + val_count]
    test_images = shuffled[train_count + val_count : train_count + val_count + test_count]

    return {"train": train_images, "validation": val_images, "test": test_images}


def clear_split_directory(directory: Path) -> None:
    if not directory.exists():
        return
    for child in directory.iterdir():
        if child.is_file() or child.is_symlink():
            child.unlink()
        elif child.is_dir():
            shutil.rmtree(child)


def copy_images_to_split(destination_dir: Path, image_paths: List[Path]) -> None:
    for source_path in image_paths:
        destination_path = destination_dir / source_path.name
        shutil.copy2(source_path, destination_path)


def prepare_dataset() -> Dict[str, int]:
    ensure_class_directories()

    for split_root in (TRAIN_ROOT, VALIDATION_ROOT, TEST_ROOT):
        for class_name in CLASS_NAMES:
            clear_split_directory(split_root / class_name)

    valid_by_class, corrupted, duplicates = collect_valid_images()

    split_summary: Dict[str, int] = {
        "total_valid_images": 0,
        "training": 0,
        "validation": 0,
        "test": 0,
        "corrupted": len(corrupted),
        "duplicates": len(duplicates),
    }

    for class_name in CLASS_NAMES:
        split_map = split_class_images(valid_by_class[class_name])

        copy_images_to_split(TRAIN_ROOT / class_name, split_map["train"])
        copy_images_to_split(VALIDATION_ROOT / class_name, split_map["validation"])
        copy_images_to_split(TEST_ROOT / class_name, split_map["test"])

        split_summary["total_valid_images"] += len(valid_by_class[class_name])
        split_summary["training"] += len(split_map["train"])
        split_summary["validation"] += len(split_map["validation"])
        split_summary["test"] += len(split_map["test"])

    return split_summary


def main() -> None:
    summary = prepare_dataset()

    print("CiviFix dataset prepared successfully.")
    print(f"Dataset root: {DATASET_ROOT}")
    print(f"Valid image files processed: {summary['total_valid_images']}")
    print(f"Training images copied: {summary['training']}")
    print(f"Validation images copied: {summary['validation']}")
    print(f"Test images copied: {summary['test']}")
    print(f"Corrupted/unreadable images: {summary['corrupted']}")
    print(f"Duplicate images skipped: {summary['duplicates']}")
    print("Classes created:")
    for class_name in CLASS_NAMES:
        print(f"  - {class_name}")


if __name__ == "__main__":
    main()
