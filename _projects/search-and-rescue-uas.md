---
title: Search and Rescue UAS
description: A nine-person team's autonomous unmanned aircraft system for search and rescue, built over two semesters.
category: university
status: "Completed"
thumbnail: /assets/img/search-and-rescue-uas/team-photo.jpg
skills:
  - UAV Systems
  - Autonomous Systems
  - Path Planning
  - Python
  - ROS
  - Computer Vision
  - Linux
  - Systems Engineering
  - Teamwork
  - Project Management
---

**Task:** as part of a nine-person team over two semesters, develop an unmanned aerial system capable of autonomously searching for a missing person, recognising them, and delivering aid, without a pilot in the loop once the mission started.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/search-and-rescue-uas/team-photo.jpg" | relative_url }}">
    <img src="{{ "/assets/img/search-and-rescue-uas/team-photo.jpg" | relative_url }}" alt="The nine-person team, with the aircraft">
  </a>
  <figcaption>The team behind the project</figcaption>
</figure>

**Approach:** I worked within the Autopilot and Navigation subsystem. A Pixhawk flight controller handled low-level flight control, talking to a Raspberry Pi companion computer over MAVLink, while the Pi ran ROS, a custom-trained YOLOv5 model over an OAK-D RGB-D camera feed for real-time object detection, and the mission logic tying it all together. The aircraft flew a planned search pattern from takeoff to landing entirely autonomously, avoiding obstacles marked in an occupancy grid. On a positive detection of the target mannequin, it would divert from its search pattern to deliver an EpiPen, streaming mission data back to a ground control station throughout. I came into the project with limited prior experience in ROS and Linux, and leaned on a systems engineering approach, breaking the navigation subsystem's requirements down into concrete, testable deliverables (calibrating the Pixhawk, verifying the Pi-to-flight-controller link, then building up to full autonomous flight) to get up to speed and contribute effectively alongside teammates who'd worked in this stack before.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/search-and-rescue-uas/drone-closeup.jpg" | relative_url }}">
    <img src="{{ "/assets/img/search-and-rescue-uas/drone-closeup.jpg" | relative_url }}" alt="Close-up of the aircraft on the bench, with its companion computer, flight controller, and connectors visible">
  </a>
  <figcaption>The aircraft up close during bench testing</figcaption>
</figure>

## Planning the search pattern

One specific piece I built was the coverage path planner: a Python tool that generates a lawnmower-style search pattern covering a defined flight area, based on the camera's field of view and a target overlap percentage between passes, so the whole search area gets photographed with no gaps. It works out row spacing from the camera footprint at the planned altitude, alternates sweep direction each row, and stitches in safe takeoff, staging, and return waypoints around the actual search pattern.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/search-and-rescue-uas/flight-plan-topdown.png" | relative_url }}">
    <img src="{{ "/assets/img/search-and-rescue-uas/flight-plan-topdown.png" | relative_url }}" alt="Top-down plot of the generated search pattern, showing the waypoint path and overlapping camera footprints covering the flight area">
  </a>
  <figcaption>Generated search pattern: waypoint path and overlapping camera footprints covering the flight area with no gaps</figcaption>
</figure>

**Outcome:** a working autonomous search-and-rescue demonstration: takeoff, a fully autonomous obstacle-avoiding search pattern, real-time onboard object detection, and an autonomous diversion to the target, all without manual piloting.

The detection and planning side of this can be seen running live: the target detected and an occupancy grid path planned around obstacles in RViz, alongside the tmux session SSH'd into the onboard Pi showing the underlying ROS logs.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/search-and-rescue-uas/gcs-visualisation.jpg" | relative_url }}">
    <img src="{{ "/assets/img/search-and-rescue-uas/gcs-visualisation.jpg" | relative_url }}" alt="RViz showing the detected target and occupancy grid with a planned path, next to a tmux session SSH'd into the onboard Pi showing live ROS logs">
  </a>
  <figcaption>RViz showing the detected target and occupancy grid with a planned path around obstacles, alongside a tmux session SSH'd into the onboard Pi</figcaption>
</figure>

The result came down to dedicated teamwork and structured planning across a large team more than any one person's individual contribution, which is the main thing I took from the project.

## Gallery

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/search-and-rescue-uas/aircraft-hardware.jpg" | relative_url }}">
      <img src="{{ "/assets/img/search-and-rescue-uas/aircraft-hardware.jpg" | relative_url }}" alt="The quadcopter on the test bench, showing the flight controller and companion computer mounted on the frame">
    </a>
    <figcaption>The aircraft on the test bench, flight controller and companion computer mounted on the frame</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/search-and-rescue-uas/gcs-terminal.jpg" | relative_url }}">
      <img src="{{ "/assets/img/search-and-rescue-uas/gcs-terminal.jpg" | relative_url }}" alt="Ground control station terminal showing live ROS topic data during a test flight">
    </a>
    <figcaption>Ground control station terminal streaming live ROS topic data during a test flight</figcaption>
  </figure>
</div>
