---
title: Robotic Arm and Computer Vision
description: A vision-guided pick-and-place robot arm, from QUT's Introduction to Robotics unit.
category: university
status: "Completed"
thumbnail: /assets/img/robotic-arm-and-computer-vision/workspace-overview.png
skills:
  - Robotics
  - Computer Vision
  - Image Processing
  - Python
---

## Project overview

An individual assignment: programme a robot arm to look at a workspace scattered with coloured blocks, work out what's there, and pick each one up and place it at the correct target location, entirely from a camera image, with no pre-programmed object positions. The project is complete: a full closed-loop pipeline from a single camera image to a finished pick-and-place sequence.

## System architecture

A single camera image drives the whole pipeline: detect every object, classify its colour and shape, calibrate pixel coordinates to real-world millimetres, match each object to its intended target, then drive the arm through the motion.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/robotic-arm-and-computer-vision/workspace-overview.png" | relative_url }}">
    <img src="{{ "/assets/img/robotic-arm-and-computer-vision/workspace-overview.png" | relative_url }}" alt="Camera view of the workspace: coloured blocks scattered on a card, with a calibration target printed in the centre">
  </a>
  <figcaption>Camera view of the workspace, blocks scattered around a printed calibration target</figcaption>
</figure>

## Selected engineering challenges and decisions

**Classifying objects on more than one crude metric.** Each object is found by converting the camera image to HSV and isolating the saturation channel, since the workspace background is duller than the brightly coloured blocks, with an automatic Otsu threshold separating objects from background and a colour-dominance test sorting the result into red, green, and blue masks. For shape, I wrote a classifier that fits a minimum-area rectangle and an ellipse to each contour and compares circularity, aspect ratio, and how tightly the shape fills each fit, to decide between a circle, an ellipse, a square, or an irregular polygon. This mattered because a single metric (circularity alone, say) is easy to fool; combining several made the classification robust enough to trust downstream.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/robotic-arm-and-computer-vision/colour-masks.png" | relative_url }}">
    <img src="{{ "/assets/img/robotic-arm-and-computer-vision/colour-masks.png" | relative_url }}" alt="Binary masks isolating the red, green, and blue objects in the workspace">
  </a>
  <figcaption>Colour-dominance masks isolating each object by colour</figcaption>
</figure>

**Calibrating pixels to real-world coordinates, with a graceful fallback.** A camera image only gives pixel coordinates, but the arm needs real-world millimetres. Four calibration markers on the target board are detected the same way as the objects, then used to compute a homography that maps any pixel coordinate to a real-world position on the workspace plane. Objects are matched to their intended targets by colour and shape, falling back gracefully (a similar shape, then just colour) if an exact match isn't available. This mattered because a blob that doesn't classify perfectly shouldn't stop the whole pipeline, it should still do something sensible.

**Driving the arm safely, not just to the right place.** Motion is driven by an inverse kinematics solver derived from the arm's own link geometry, converting a desired tool position into the three joint angles needed to reach it, with a reachability check so an out-of-range target fails clearly rather than silently. Moves are interpolated into small straight-line steps rather than jumping straight to the target, so the arm follows a smooth, predictable path and lifts each object clear before moving across the workspace. This mattered because a kinematics solution that's mathematically correct but drives the arm through an unsafe or unpredictable path isn't actually a usable motion plan.

## Verification or evidence

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/robotic-arm-and-computer-vision/detected-objects.png" | relative_url }}">
    <img src="{{ "/assets/img/robotic-arm-and-computer-vision/detected-objects.png" | relative_url }}" alt="The workspace image annotated with each detected object's colour, shape, and classification">
  </a>
  <figcaption>Every object correctly identified by colour and shape, ready for pick-and-place</figcaption>
</figure>

The complete pipeline ran end to end: every object detected, classified, matched to its target, and placed by a smooth arm motion, with objects stacked correctly at target locations already holding a previous object rather than colliding into them.

## Current status

**Completed:** the full detect-classify-calibrate-match-move pipeline works end to end. This was a closed university assessment; no further development is planned.

## What I learned or am proud of

The design choice I'd reuse elsewhere is building in graceful degradation rather than letting any single weak link stop the whole system: a fallback matching chain when classification isn't perfect, a reachability check that fails clearly instead of crashing or doing something undefined. A robotics pipeline with several independent stages is only as reliable as its weakest one unless you deliberately design for what happens when that stage isn't perfect.
