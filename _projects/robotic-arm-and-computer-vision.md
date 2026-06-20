---
title: Robotic Arm and Computer Vision
description: A vision-guided pick-and-place robot arm, from QUT's Introduction to Robotics unit.
category: university
thumbnail: /assets/img/robotic-arm-and-computer-vision/workspace-overview.png
skills:
  - Robotics
  - Computer Vision
  - Image Processing
  - Python
---

**Task:** programme a robot arm to look at a workspace scattered with coloured blocks, work out what's there, and pick each one up and place it at the correct target location, entirely from a camera image, with no pre-programmed object positions.

**Approach:** the arm's motion is driven by an inverse kinematics solver I derived from the arm's own link geometry, converting a desired tool position into the three joint angles needed to reach it, with a reachability check so it fails clearly rather than silently if a target is out of range. Moves are interpolated into a sequence of small straight-line steps rather than jumping straight to the target, so the arm follows a smooth, predictable path and lifts each object clear before moving across the workspace.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/robotic-arm-and-computer-vision/workspace-overview.png" | relative_url }}">
    <img src="{{ "/assets/img/robotic-arm-and-computer-vision/workspace-overview.png" | relative_url }}" alt="Camera view of the workspace: coloured blocks scattered on a card, with a calibration target printed in the centre">
  </a>
  <figcaption>Camera view of the workspace, blocks scattered around a printed calibration target</figcaption>
</figure>

## Finding and identifying the objects

Each object is found by converting the camera image to HSV and isolating the saturation channel, since the workspace background is duller and less saturated than the brightly coloured blocks. An automatic Otsu threshold separates objects from background, then a colour-dominance test sorts the result into red, green, and blue masks. For each detected blob, I wrote a shape classifier that fits a minimum-area rectangle and an ellipse to the contour and compares circularity, aspect ratio, and how tightly the shape fills each fit, to decide whether it's looking at a circle, an ellipse, a square, or an irregular polygon, rather than relying on a single crude metric.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/robotic-arm-and-computer-vision/colour-masks.png" | relative_url }}">
    <img src="{{ "/assets/img/robotic-arm-and-computer-vision/colour-masks.png" | relative_url }}" alt="Binary masks isolating the red, green, and blue objects in the workspace">
  </a>
  <figcaption>Colour-dominance masks isolating each object by colour</figcaption>
</figure>

## Calibrating pixels to real-world coordinates

A camera image only gives pixel coordinates, but the arm needs real-world millimetres. Four calibration markers printed on the target board are detected the same way as the objects, then used to compute a homography, a perspective transform that maps any pixel coordinate in the image to a real-world position on the workspace plane. Every detected object's pixel position is run through that transform to get the coordinate the arm actually needs to drive to. Objects are then matched to their intended targets by colour and shape, falling back gracefully (matching a similar shape, then just colour) if an exact match isn't available, so the system still does something sensible if a blob doesn't classify cleanly.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/robotic-arm-and-computer-vision/detected-objects.png" | relative_url }}">
    <img src="{{ "/assets/img/robotic-arm-and-computer-vision/detected-objects.png" | relative_url }}" alt="The workspace image annotated with each detected object's colour, shape, and classification">
  </a>
  <figcaption>Final detection result: every object correctly identified by colour and shape, ready for pick-and-place</figcaption>
</figure>

**Outcome:** a complete closed-loop pipeline from a single camera image to a finished pick-and-place sequence: detect every object, classify its colour and shape, calibrate pixel coordinates to real-world millimetres, match each object to its target, and drive the arm through a smooth pick-and-place motion for every one of them, stacking objects placed at the same target location rather than colliding into ones already there.
