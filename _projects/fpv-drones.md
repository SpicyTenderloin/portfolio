---
title: FPV Drones
description: Building and flying FPV drones, from tiny whoops to 5-inch freestyle quads.
category: personal
status: "In progress"
thumbnail: /assets/img/fpv-drones/Soldering.jpg
skills:
  - FPV
  - FPV Acro Mode
  - Soldering
  - Drone Building
---

## Project overview

An ongoing personal hobby: building, repairing, and flying FPV drones, from tiny whoops to 5-inch freestyle quads. This page covers a few distinct facets of it rather than a single build, repair work, simulator practice, and an active 5" build, and keeps growing as new builds and repairs happen.

## Tiny Whoops

Tiny whoops take a lot of crash damage for their size, and motors are usually the first thing to go, so replacing one is a routine repair rather than a rare one. Inspecting and reflowing the solder joints under magnification makes the difference between a clean, reliable repair and one that fails again mid-flight.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/fpv-drones/tiny-whoop-motor-soldering.jpg" | relative_url }}">
    <img src="{{ "/assets/img/fpv-drones/tiny-whoop-motor-soldering.jpg" | relative_url }}" alt="Magnified view of a tiny whoop flight controller board, checking the solder joints after a motor replacement">
  </a>
  <figcaption>Checking the solder joints under magnification after a motor replacement</figcaption>
</figure>

## Practicing in the simulator

Acro mode has no self-levelling: the sticks command rotation rates directly, and the pilot is fully responsible for attitude, so building that muscle memory in a simulator first is far cheaper than doing it over real hardware. I use a Radiomaster transmitter bound directly to a laptop simulator to practice freestyle and racing lines before flying them for real.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/fpv-drones/fpv-simulator-practice.png" | relative_url }}">
    <img src="{{ "/assets/img/fpv-drones/fpv-simulator-practice.png" | relative_url }}" alt="Holding a Radiomaster transmitter in front of a laptop running an FPV drone simulator, flying a simulated course over a city">
  </a>
  <figcaption>Practicing acro-mode flying in a simulator before taking it to real hardware</figcaption>
</figure>

That practice carries straight over to real flying: the same acro inputs, now with a real digital HD FPV feed and OSD (voltage, GPS lock, link strength) instead of a simulated one.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/fpv-drones/fpv-pov-flying.jpg" | relative_url }}">
    <img src="{{ "/assets/img/fpv-drones/fpv-pov-flying.jpg" | relative_url }}" alt="First-person view from a digital HD FPV system, OSD showing voltage, GPS lock, and link strength, looking down at the pilot on a porch">
  </a>
  <figcaption>The real thing: digital HD FPV feed and OSD, flying for real after practicing in the simulator</figcaption>
</figure>

## SpeedyBee 5" Drone

5-inch FPV quadcopter build using a SpeedyBee F405 V4 flight controller stack, working from the board's own pinout reference to wire up the LED, VTX, and receiver connections correctly.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/fpv-drones/f405-v4-pinout.png" | relative_url }}">
      <img src="{{ "/assets/img/fpv-drones/f405-v4-pinout.png" | relative_url }}" alt="SpeedyBee F405 V4 flight controller pinout diagram, labelling the Betaflight LED, analog and DJI VTX, and SBUS pads">
    </a>
    <figcaption>The F405 V4's pinout, used as the wiring reference for this build</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/fpv-drones/Soldering.jpg" | relative_url }}">
      <img src="{{ "/assets/img/fpv-drones/Soldering.jpg" | relative_url }}" alt="Soldering work on the SpeedyBee build">
    </a>
    <figcaption>Soldering work on the SpeedyBee build</figcaption>
  </figure>
</div>

Build log and more photos coming soon.

## Current status

**In progress:** the SpeedyBee 5" build is wired and being finished off; tiny whoop repairs and simulator practice are ongoing, not one-off events.
