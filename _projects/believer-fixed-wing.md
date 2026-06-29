---
title: Believer Fixed Wing Drone
description: Long-range fixed-wing UAV built through QUT Aerospace Society for BVLOS observation missions, shark spotting, ecosystem monitoring, and agricultural surveying.
category: club
status: "Pre-maiden"
thumbnail: /assets/img/believer-fixed-wing/Believer.jpg
skills:
  - PX4
  - UAV Systems
  - RF Design
  - Systems Engineering
  - RC Aircraft
  - 3D Printing
---

## Project overview

Believer is a long-range, fixed-wing UAS developed through the QUT Aerospace Society (QUTAS) as a research and development platform for prospective beyond-visual-line-of-sight environmental-monitoring and aerial-survey applications. Potential future uses include shark spotting, threatened-ecosystem monitoring, and agricultural surveying.

I have developed the project end-to-end, from system architecture and avionics integration through to mechanical installation, PX4 configuration, ground verification, and flight-readiness planning. The aircraft is a V-tail, twin-motor platform built around a Holybro Pixhawk 6X flight controller running PX4, with long-range telemetry, ExpressLRS control, dual GNSS receivers, airspeed sensing, and onboard power monitoring.

Avionics integration and ground verification are substantially complete, with final configuration, RTK GPS commissioning, and the maiden flight remaining.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/Believer.jpg" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/Believer.jpg" | relative_url }}" alt="The Believer fixed-wing drone, ready to fly, with ground control laptop and transmitter">
  </a>
  <figcaption>The Believer fixed-wing drone, with ground control laptop and transmitter</figcaption>
</figure>

## System architecture

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/icd-block-diagram-preview.png" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/icd-block-diagram-preview.png" | relative_url }}" alt="Believer ICD block diagram: the Pixhawk 6X at the centre, wired to the DBR4 receiver, RFD900x telemetry radio, M8N and ZED-F9P GPS modules, MS4525DO airspeed sensor, and PWM-driven control surfaces and motors, powered through the PM03D module from a 6S LiPo battery">
  </a>
  <figcaption>Believer's ICD block diagram: the full avionics architecture in one view</figcaption>
</figure>

The Pixhawk 6X sits at the centre of the avionics architecture:

| Component | Role |
|---|---|
| RC link (GX12 → DBR4, ExpressLRS) | Primary flight control; pilot commands and MAVLink telemetry over a single radio |
| Telemetry (RFD900x) | Long-range, two-way MAVLink to the ground station |
| GPS 1 (u-blox M8N) | Primary position and navigation |
| GPS 2 (SparkFun ZED-F9P) | RTK-corrected centimetre-level positioning (antenna installation pending) |
| Airspeed (MS4525DO, I2C) | Differential pressure measurement for autopilot airspeed control |
| Power (Holybro PM03D, INA228) | Battery voltage and current monitoring; isolated 5V servo rail |
| Actuators (PWM, MAIN 1-6) | V-tail, aileron, and motor commands |

## Power telemetry validation

Reliable battery telemetry is a flight-safety requirement. It supports pre-flight checks, remaining-endurance estimates, low-battery failsafes, and every battery-related decision.

The original power module was a Holybro PM06, which provides analogue voltage and current outputs. The Pixhawk 6X expects battery telemetry through its digital power-monitor interface, so it could not obtain a valid battery measurement from the PM06. In QGroundControl, this appeared as unavailable calibration fields, a zero cell count, a battery indication of -100%, and other values that could not be treated as trustworthy.

Rather than attempting to calibrate invalid telemetry, I replaced the PM06 with a Holybro PM03D digital power module. The PM03D communicates voltage and current data over I2C using an INA228 power-monitor IC, making it suitable for the Pixhawk 6X.

The hardware change resolved the interface mismatch but did not immediately produce complete telemetry. Initial readings from the PM03D remained incomplete or erroneous because PX4 had not enabled the INA228 driver. Enabling the SENS_EN_INA228 parameter and rebooting the flight controller allowed PX4 to initialise the correct driver and read the power module correctly.

Following this configuration change, battery voltage and current telemetry became coherent in ground testing, providing a reliable basis for battery configuration, pre-flight checks, and in-flight monitoring.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/battery-setup-uncalibrated.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/battery-setup-uncalibrated.png" | relative_url }}" alt="QGroundControl battery setup screen with unavailable calibration fields and zero cell count">
    </a>
    <figcaption>PM06 analogue power module: calibration was unavailable because the Pixhawk 6X was not receiving a valid digital battery signal.</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/battery-negative-100-percent.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/battery-negative-100-percent.png" | relative_url }}" alt="Battery indicator reading negative 100 percent">
    </a>
    <figcaption>PM06 analogue power module: invalid telemetry produced a battery reading of -100%.</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/battery-voltage-blank.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/battery-voltage-blank.png" | relative_url }}" alt="QGroundControl status panel showing Charge State Ok beside a blank voltage field">
    </a>
    <figcaption>PM03D installed, but INA228 driver not yet enabled: "Charge State: Ok" appeared beside a blank voltage field, indicating incomplete telemetry.</figcaption>
  </figure>
</div>

<!-- PLACEHOLDER: add fourth screenshot here when provided -->
<!-- Image path: /assets/img/believer-fixed-wing/<filename> -->
<!-- Caption: PM03D telemetry after enabling the INA228 driver: coherent battery voltage and current data in QGroundControl. -->

## Tuning the long-range RF link

The RFD900x telemetry link worked out of the box, but "working" and "configured for the mission" are different things. The key tradeoff is between AIR_SPEED (the over-the-air bitrate) and SERIAL_SPEED (the UART rate to the flight controller): the serial side has to stay within what the air side can actually sustain, or the link bottlenecks and drops packets silently. Encryption, channel-hopping range, and transmit power are all separate tradeoffs again, each trading range, robustness, or regulatory headroom against bandwidth or security; there is no single "better" setting across all of them.

Because tuning is just plain text over a serial connection, I verified the configuration two independent ways: RFDesign's own graphical tool, and AT commands read directly over a terminal, confirming the same settings either way.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/rfd900-gui-tool.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/rfd900-gui-tool.png" | relative_url }}" alt="RFDesign's RFD SiK configuration tool, showing the RFD900P's settings: baud, air speed, frequency range, channel count, transmit power, and more">
    </a>
    <figcaption>RFDesign's configuration tool</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/rfd900-at-commands-terminal.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/rfd900-at-commands-terminal.png" | relative_url }}" alt="A PuTTY serial terminal session sending AT commands to the modem, listing its current parameters via ATI5">
    </a>
    <figcaption>The same settings, read back over AT commands</figcaption>
  </figure>
</div>

That same serial interface, a simple text protocol over a known port, means a companion computer could eventually retune the link automatically in flight without any hardware change.

## A modular, glue-free avionics bay

The avionics suite is still evolving toward a companion-computer phase, so I avoided fixing components to the airframe with adhesive: a permanent solution for what is still an iterative design. Instead, a custom 3D-printed bay mounts the flight controller, GPS modules, telemetry radio, and power module mechanically, so any module can be swapped or repositioned by reprinting the bay rather than cutting into the airframe.

The photos below trace the design from an early bench layout to the empty bay built into the fuselage, through to the current fully-populated installation:

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/avionics-bay-initial-design.jpg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/avionics-bay-initial-design.jpg" | relative_url }}" alt="An early avionics mounting design: the RFD900 modem, a power distribution board, and a GPS module mounted on a flat bracket, no airframe yet">
    </a>
    <figcaption>An early mounting layout, worked out on the bench</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/avionics-bay-empty.jpg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/avionics-bay-empty.jpg" | relative_url }}" alt="The empty avionics bay built into the airframe, before any avionics are installed, with the tail antenna feed-through already in place">
    </a>
    <figcaption>The bay built into the airframe, ready for avionics</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/avionics-bay-current.jpg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/avionics-bay-current.jpg" | relative_url }}" alt="The current avionics bay inside the airframe, labelled: flight computer (Pixhawk 6X), long range modem, radio receiver, and GPS 1">
    </a>
    <figcaption>The current bay, fully populated</figcaption>
  </figure>
</div>

## Keeping the antennas clear of the avionics bay

The RFD900x's own antennas presented a second mechanical problem. At 900MHz they are too long to fit inside the bay while staying properly orthogonal to each other, the spacing that gives a diversity receive link its benefit. A transmitter that close to the GPS receivers also risked interference. A custom external mount solves both problems at once.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/antenna-mount-cad-design.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/antenna-mount-cad-design.png" | relative_url }}" alt="CAD render of the custom antenna mount: a knurled, threaded bulkhead fitting on a mounting bracket">
    </a>
    <figcaption>The custom mount, designed in CAD</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/external-antenna-and-sensor-mount.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/external-antenna-and-sensor-mount.png" | relative_url }}" alt="Rear view of the Believer airframe, showing the externally-mounted telemetry antenna and the GPS/magnetometer mast on top of the fuselage">
    </a>
    <figcaption>Fitted: the antenna and GPS/magnetometer mast, clear of the bay</figcaption>
  </figure>
</div>

## Configuration control as a safety practice

Believer's documentation lives in its own private GitHub repo: the project outline, interface control document, flight manual, spending history, datasheets, and the PX4 parameter change log, treated as the project's operating record rather than an afterthought. I maintain it with AI assistance, working from a `context` folder of standing directives read at the start of every session, so conventions and accumulated facts carry across sessions rather than living in one chat history.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/context-folder-structure.png" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/context-folder-structure.png" | relative_url }}" alt="Believer's context folder: standing directives, project notes, and a running change log, plus a supporting-document archive">
  </a>
  <figcaption>Believer's context folder: standing directives, project notes, and a running change log</figcaption>
</figure>

Those directives tell the AI to mark anything unconfirmed as TBD rather than guess, and to flag a judgement call rather than quietly making one, the same discipline behind catching the power-module and RC-channel issues above rather than discovering them in flight. Done this way, the documentation process improves traceability rather than trading it for speed, which matters on a project whose records people will rely on to fly the aircraft safely.

## Next phase

Fit the RTK GPS antenna, run a final pre-flight configuration and tuning pass with a build log, then the maiden flight. After that: flight controller tuning and expanded flight testing per the original project roadmap. Further out, and not yet started: a companion computer and camera payload for onboard object detection, the long-term purpose the platform is being built toward.

## Gallery

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/actuator-output-config.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/actuator-output-config.png" | relative_url }}" alt="PX4 actuator output configuration screen, showing the six PWM channels mapped to the V-tail, ailerons, and motors">
    </a>
    <figcaption>PX4 actuator output configuration: six PWM channels mapped to the V-tail, ailerons, and motors</figcaption>
  </figure>
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
    <figcaption>The RFD900x's pinout</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/early-ground-test-qgc.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/early-ground-test-qgc.png" | relative_url }}" alt="QGroundControl's map view during an early ground test, showing GPS position acquired and the aircraft not yet armed in Manual mode">
    </a>
    <figcaption>Early ground test: GPS position acquired in QGroundControl</figcaption>
  </figure>
</div>
