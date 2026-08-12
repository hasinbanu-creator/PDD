#!/usr/bin/env python3
"""Generate a dataset summary report for the CiviFix image dataset.

This report reflects the actual files present in the raw dataset, including corruption,
duplicates, missing classes, and split counts.
"""

from __future__ import annotations

import hashlib
from collections import defaultdict
from pathlib import Path

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

DATASET_ROOT = Path(__file__).resolve().parent / "dataset"
RAW_ROOT = DATASET_ROOT / "raw"
TRAIN_ROOT = DATASET_ROOT / "train"
VALIDATION_ROOT = DATASET_ROOT / "validation"
TEST_ROOT = DATASET_ROOT / "test"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def is_valid_image(path: Path) -> bool:
    try:
        with Image.open(path) as img:
            img.verify()
        with Image.open(path) as img:
            img.load()
            if img.size[0] <= 0 or img.size[1] <= 0:
                return False
        return True
    except (OSError, ValueError, UnidentifiedImageError):
        return False


def list_supported_images(directory: Path) -> list[Path]:
    if not directory.exists():
        return []

    return sorted(
        [path for path in directory.rglob("*") if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS],
        key=lambda item: item.name.lower(),
    )


def count_class_images(directory: Path) -> dict[str, int]:
    counts = {}
    for class_name in CLASS_NAMES:
        folder = directory / class_name
        counts[class_name] = len(list_supported_images(folder))
    return counts


def gather_raw_dataset_stats() -> dict:
    total_images = 0
    total_per_class = defaultdict(int)
    corrupted = 0
    duplicates = 0
    seen_hashes: dict[str, str] = {}

    for class_name in CLASS_NAMES:
        for image_path in list_supported_images(RAW_ROOT / class_name):
            file_hash = sha256_file(image_path)
            if file_hash in seen_hashes:
                duplicates += 1
                continue
            seen_hashes[file_hash] = class_name

            if not is_valid_image(image_path):
                corrupted += 1
                continue

            total_images += 1
            total_per_class[class_name] += 1

    return {
        "total_images": total_images,
        "per_class": dict(total_per_class),
        "corrupted": corrupted,
        "duplicates": duplicates,
    }


def print_section(title: str) -> None:
    print(f"\n{title}")
    print("-" * len(title))


def main() -> None:
    raw_stats = gather_raw_dataset_stats()
    train_counts = count_class_images(TRAIN_ROOT)
    validation_counts = count_class_images(VALIDATION_ROOT)
    test_counts = count_class_images(TEST_ROOT)

    missing_classes = [
        class_name for class_name in CLASS_NAMES if raw_stats["per_class"].get(class_name, 0) == 0
    ]
    classes_with_few_images = [
        class_name for class_name in CLASS_NAMES if raw_stats["per_class"].get(class_name, 0) > 0 and raw_stats["per_class"].get(class_name, 0) < 5
    ]

    print_section("CiviFix Dataset Report")
    print(f"Dataset root: {DATASET_ROOT}")
    print(f"Total images (valid unique raw images): {raw_stats['total_images']}")
    print(f"Corrupted image count: {raw_stats['corrupted']}")
    print(f"Duplicate image count: {raw_stats['duplicates']}")

    print_section("Images by class")
    for class_name in CLASS_NAMES:
        raw_count = raw_stats["per_class"].get(class_name, 0)
        print(
            f"{class_name:<24} raw={raw_count:>3} | train={train_counts.get(class_name, 0):>3} | "
            f"validation={validation_counts.get(class_name, 0):>3} | test={test_counts.get(class_name, 0):>3}"
        )

    print_section("Missing classes")
    if missing_classes:
        print(", ".join(missing_classes))
    else:
        print("None")

    print_section("Classes with very few images")
    if classes_with_few_images:
        print(", ".join(classes_with_few_images))
    else:
        print("None")

    print_section("Raw class totals")
    for class_name in CLASS_NAMES:
        print(f"{class_name}: {raw_stats['per_class'].get(class_name, 0)}")


if __name__ == "__main__":
    main()
