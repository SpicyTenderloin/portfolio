---
title: Believer Fixed Wing Drone
description: Long-range fixed-wing UAV built through QUT Aerospace Society for BVLOS observation missions, shark spotting, ecosystem monitoring, and agricultural surveying.
category: club
thumbnail: /assets/img/believer-fixed-wing/Believer.jpg
skills:
  - PX4
  - Autopilot Systems
  - UAV Systems
  - Systems Engineering
  - RC Aircraft
  - Flight Testing
  - Project Management
  - Remote Sensing
---

**Task:** as UAS Systems Lead and Program Manager for the QUT Aerospace Society (QUTAS), lead the avionics integration and flight-readiness work on Believer, a long-range, beyond-visual-line-of-sight (BVLOS) fixed-wing observation platform. The aim is a long-range aircraft capable of advanced onboard decision-making, including object detection, for missions like shark spotting, monitoring of threatened ecosystems, and agricultural surveying.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/Believer.jpg" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/Believer.jpg" | relative_url }}" alt="The Believer fixed-wing drone, ready to fly, with ground control laptop and transmitter">
  </a>
  <figcaption>The Believer fixed-wing drone, ready to fly, with ground control laptop and transmitter</figcaption>
</figure>

**Approach:** Believer is a V-tail, twin-motor airframe with two independently-servoed ailerons, built around a Holybro Pixhawk 6X flight controller running PX4. Each control surface and motor is mapped to its own PWM output, configured and verified directly in PX4's actuator setup.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/actuator-output-config.png" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/actuator-output-config.png" | relative_url }}" alt="PX4 actuator output configuration screen, showing the six PWM channels mapped to the V-tail, ailerons, and motors">
  </a>
  <figcaption>PX4 actuator output configuration: six PWM channels mapped to the V-tail, ailerons, and motors</figcaption>
</figure>

The long-range command link runs over an RFD900x radio modem, while the RC link pairs a Radiomaster GX12 transmitter with a DBR4 receiver over dual-band ExpressLRS, configured in Hybrid switch mode with MAVLink so RC control and telemetry share the one radio link without a second dedicated radio.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/rfd900-module-photo.jpeg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/rfd900-module-photo.jpeg" | relative_url }}" alt="The RFD900x telemetry radio module">
    </a>
    <figcaption>The RFD900x long-range telemetry radio</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/rfd900-pinout-diagram.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/rfd900-pinout-diagram.png" | relative_url }}" alt="RFD900x pinout diagram used to wire the module to the flight controller">
    </a>
    <figcaption>Its pinout, used to wire it into the flight controller's telemetry port</figcaption>
  </figure>
</div>

Navigation runs off two GPS receivers: a u-blox NEO-M8N as the primary fix, and a u-blox ZED-F9P wired in as a path to RTK, centimetre-level positioning once its antenna and a correction source are in place. An MS4525DO differential pressure sensor provides airspeed, and a Holybro PM03D power module feeds the flight controller and an electrically isolated 5V servo rail, while reporting battery voltage and current back over its onboard INA228 monitor.

## Two integration problems worth solving properly

Getting the RC link working cleanly took more than just pairing a transmitter and receiver. ExpressLRS Hybrid mode only carries the first 12 RC channels, and the flight-mode selector switch was originally wired to channel 13, so PX4 never saw it move. The fix was a full remap: arm onto its own dedicated channel, kill onto another, the six-position flight-mode switch onto a channel that's actually transmitted, and a separate channel repurposed as a direct override into Hold, so there's a fast backup path into a safe holding pattern independent of whatever mode the main selector is in.

The power module took a few iterations too. An earlier candidate looked right on paper but turned out to report battery telemetry in a format the Pixhawk doesn't accept, so it got swapped out before it ever flew. The Holybro PM03D fitted now, partly sourced out of pocket once that gap turned up, gives the flight controller the voltage and current readings it needs and keeps the servo rail electrically isolated from the main supply.

**Outcome:** establishing a redundant RC control link was the near-term goal in the original project proposal, and it's now done. Most of the maiden-flight build checklist is complete too: airframe, avionics mounting, pitot and magnetometer installation, antenna placement, and a parachute bay repair are all finished. What's left is mostly cosmetic (paint) and procedural (a final configuration and tuning pass, with a build log to document it), aside from one real hardware blocker: the RTK GPS module still needs its antenna fitted before centimetre-level positioning can come online. Flight controller tuning and expanded flight testing are next, with a companion computer and camera payload for onboard object detection planned further out.
