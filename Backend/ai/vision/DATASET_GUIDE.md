# CiviFix Image Dataset Guide

This dataset is for a local image-verification workflow only. It does not train or integrate an AI model, and it does not change the complaint creation flow or the existing feedback/NLP code paths.

## 1. Where to place images

Put your manually collected CiviFix images in:

Backend/ai/vision/dataset/raw/

Each complaint class must have its own folder under raw/.

Example structure:

```text
Backend/
└── ai/
    └── vision/
        └── dataset/
             ├── raw/
             │   ├── garbage_waste/
             │   ├── road_damage/
             │   ├── pothole/
             │   ├── street_light/
             │   ├── drainage_issue/
             │   ├── road_waterlogging/
             │   └── construction_block/
            ├── train/
            ├── validation/
            └── test/
```

## 2. Exact class folder names

Use these exact folder names under raw/, train/, validation/, and test/:

- garbage_waste
- road_damage
- pothole
- street_light
- drainage_issue
- road_waterlogging
- construction_block

## 3. Supported image formats

The dataset preparation script accepts these image file types:

- .jpg
- .jpeg
- .png
- .bmp
- .webp
- .tif
- .tiff

Files that cannot be opened, are corrupted, or are empty/invalid are marked as corrupted and excluded from the prepared dataset.

## 4. How to run the dataset preparation script

From the project root, run:

```bash
cd /Users/hasinnn/Documents/PDD
python Backend/ai/vision/prepare_dataset.py
```

The script will:

1. Read valid files from Backend/ai/vision/dataset/raw/
2. Validate each image
3. Detect corrupted or unreadable images
4. Detect exact duplicate images
5. Split the valid images into train, validation, and test folders
6. Copy the images into the correct split folders

The split is deterministic because it uses a fixed random seed.

## 5. How the 80/10/10 split works

The script uses a fixed random seed and performs a class-wise split as closely as possible to:

- 80% training
- 10% validation
- 10% testing

This is done on each class folder independently so class balance is preserved as much as possible.

Important rule:

- the same image is never copied into more than one split
- duplicate images are skipped instead of being copied into multiple folders

If a class has very few images, the split may be skewed slightly so that the dataset still remains valid and non-empty where possible.

## 6. How to generate the dataset report

Run:

```bash
cd /Users/hasinnn/Documents/PDD
python Backend/ai/vision/generate_dataset_report.py
```

The report shows:

- total images
- images in each class
- training images per class
- validation images per class
- test images per class
- corrupted image count
- duplicate image count
- missing classes
- classes with very few images

## 7. How to add more images later

Add more photos by placing them directly into the relevant class folder under raw/.

Example:

```text
Backend/ai/vision/dataset/raw/pothole/
    pothole_001.jpg
    pothole_002.jpg
    pothole_003.png
```

Then rerun:

```bash
python Backend/ai/vision/prepare_dataset.py
```

This reprocesses the current raw dataset and recreates the split folders.

## 8. How duplicate and corrupted images are handled

The scripts handle these cases automatically:

- corrupted or unreadable images: skipped and counted in the report
- exact duplicate images: skipped and counted in the report
- missing classes: listed in the report as missing

This prevents invalid files and repeated images from being copied into the train, validation, or test sets.

## Dataset safety rules

This dataset setup is intentionally limited to data preparation only:

- no AI model is trained
- no model is fine-tuned
- no pretrained model is downloaded
- no external AI API is used
- no complaint workflow is changed
- no web or mobile code is modified

The dataset is ready for local image preparation work only.
