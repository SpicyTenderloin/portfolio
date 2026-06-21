---
title: Semantic Image Segmentation Software
description: Classical and machine-learning image segmentation compared head to head, from QUT's Digital Signals and Image Processing unit.
category: university
status: "Completed"
thumbnail: /assets/img/semantic-image-segmentation-software/sun-best-case.jpg
skills:
  - Image Processing
  - Computer Vision
  - Machine Learning
  - AI-Assisted Development
  - Python
  - Teamwork
  - Project Management
---

**Task:** as part of a small team, build and compare two contrasting approaches to image segmentation, a classical pixel-based method and a machine-learning model, then extend one of them to make use of depth-camera data, evaluating all of it against the SUN RGB-D and NYU Depth v2 benchmark datasets using IoU, Dice score, and pixel accuracy.

**Approach:** my own contribution was the classical segmentation pipeline and the performance-metric calculations used to evaluate every method in the report, while a teammate developed a ResNet-U-Net machine learning model for the same task, later extended with a depth channel through mid-level fusion, satisfying the brief's requirement for two genuinely different segmentation paradigms rather than just two minor variants of the same approach. The classical pipeline converts each image into the perceptually uniform CIELAB colour space, smooths it with a mean-shift filter to suppress false edges while preserving real boundaries, enhances local contrast with adaptive histogram equalisation to bring out weak edges in dark regions, then runs Canny edge detection with thresholds set dynamically from each image's own gradient statistics rather than a single fixed threshold, since the right threshold varies a lot between scenes. A final pass of morphological closing, dilation, and region-filling turns the resulting edge map into clean, enclosed regions.

**Outcome:** across both datasets the classical method achieved a pixel accuracy of around 69 to 70% and an average IoU of roughly 0.65 to 0.68, fast and competitive without any training data. The more interesting finding came from looking at individual scenes rather than just the averages: the worst-scoring result by IoU actually had visibly better segmentation than the best-scoring one, because the ground truth labels themselves were coarse for that scene, merging detailed structure into one large region.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/semantic-image-segmentation-software/sun-worst-case.jpg" | relative_url }}">
    <img src="{{ "/assets/img/semantic-image-segmentation-software/sun-worst-case.jpg" | relative_url }}" alt="Lowest-IoU scene: the prediction actually captures more real detail than the coarse ground truth labels do">
  </a>
  <figcaption>Lowest IoU score in the dataset, despite the prediction capturing more real detail than the coarse ground truth</figcaption>
</figure>

Meanwhile, a clean, well-labelled ground truth elsewhere misleadingly inflated the score for an image where the edge detector had actually missed real boundaries.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/semantic-image-segmentation-software/sun-best-case.jpg" | relative_url }}">
    <img src="{{ "/assets/img/semantic-image-segmentation-software/sun-best-case.jpg" | relative_url }}" alt="Highest-IoU scene, despite some real boundaries being missed by the edge detector">
  </a>
  <figcaption>Highest IoU score, despite some real boundaries being missed</figcaption>
</figure>

It was a good reminder that a single quantitative metric can disagree with what your eyes tell you, and that's worth checking before trusting the number.
