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
  - Technical Documentation
  - AI-Assisted Development
  - RF Design
  - 3D Printing
---

**Task:** as UAS Systems Lead and Program Manager for the QUT Aerospace Society (QUTAS), lead the avionics integration and flight-readiness work on Believer, a long-range, beyond-visual-line-of-sight (BVLOS) fixed-wing observation platform. The aim is a long-range aircraft capable of advanced onboard decision-making, including object detection, for missions like shark spotting, monitoring of threatened ecosystems, and agricultural surveying.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/Believer.jpg" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/Believer.jpg" | relative_url }}" alt="The Believer fixed-wing drone, ready to fly, with ground control laptop and transmitter">
  </a>
  <figcaption>The Believer fixed-wing drone, ready to fly, with ground control laptop and transmitter</figcaption>
</figure>

**Approach:** the diagram below is the system block diagram from Believer's own interface control document, the full avionics architecture at a glance before the detail below unpacks each link.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/icd-block-diagram-preview.png" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/icd-block-diagram-preview.png" | relative_url }}" alt="Believer ICD block diagram: the Pixhawk 6X at the centre, wired to the DBR4 receiver, RFD900x telemetry radio, M8N and ZED-F9P GPS modules, MS4525DO airspeed sensor, and PWM-driven control surfaces and motors, powered through the PM03D module from a 6S LiPo battery">
  </a>
  <figcaption>Believer's ICD block diagram: the full avionics architecture in one view</figcaption>
</figure>

Believer is a V-tail, twin-motor airframe with two independently-servoed ailerons, built around a Holybro Pixhawk 6X flight controller running PX4. Each control surface and motor is mapped to its own PWM output, configured and verified directly in PX4's actuator setup.

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

## Integration problems worth solving properly

Getting the RC link working cleanly took more than just pairing a transmitter and receiver. ExpressLRS Hybrid mode only carries the first 12 RC channels, and the flight-mode selector switch was originally wired to channel 13, so PX4 never saw it move. The fix was a full remap: arm onto its own dedicated channel, kill onto another, the six-position flight-mode switch onto a channel that's actually transmitted, and a separate channel repurposed as a direct override into Hold, so there's a fast backup path into a safe holding pattern independent of whatever mode the main selector is in.

The power module took a few iterations too. An earlier candidate looked right on paper but turned out to report battery telemetry in a format the Pixhawk doesn't accept, so it got swapped out before it ever flew. The symptoms were hard to miss once it was wired up: a battery setup left uncalibrated because the reported values didn't make sense to calibrate against, a battery percentage reading shown as -100%, and a status panel confidently reporting "Charge State: Ok" right next to a voltage field that was simply blank.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/battery-setup-uncalibrated.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/battery-setup-uncalibrated.png" | relative_url }}" alt="QGroundControl battery setup screen with the cell count at 0 and the voltage divider and amps-per-volt calibration both left at -1, uncalibrated">
    </a>
    <figcaption>Left uncalibrated: there was no sensible reading yet to calibrate against</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/battery-negative-100-percent.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/battery-negative-100-percent.png" | relative_url }}" alt="Battery indicator reading negative 100 percent">
    </a>
    <figcaption>A battery reading of -100%</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/battery-voltage-blank.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/battery-voltage-blank.png" | relative_url }}" alt="QGroundControl status panel showing Charge State Ok next to a blank voltage field">
    </a>
    <figcaption>"Charge State: Ok," voltage blank, the contradiction that gave the mismatch away</figcaption>
  </figure>
</div>

The Holybro PM03D fitted now, partly sourced out of pocket once that gap turned up, gives the flight controller the voltage and current readings it needs and keeps the servo rail electrically isolated from the main supply.

The RFD900x telemetry link connected fine straight out of the box, but getting the highest practical bitrate out of it meant learning how the modems actually work and tuning several parameters directly on them rather than trusting the defaults. AIR_SPEED (the over-the-air data rate) and SERIAL_SPEED (the baud rate between the radio and the flight controller) set the achievable throughput between them, and SERIAL_SPEED has to stay sensible relative to what AIR_SPEED can actually sustain, or the link bottlenecks. Encryption, channel hopping range, and transmit power are separate tradeoffs again, each trading some mix of range, robustness, and regulatory headroom for security or bandwidth, rather than there being one setting that's simply better.

Both modems expose these settings two ways: through RFDesign's own configuration software, or directly over the same serial link using AT commands, the same simple text command language (the name comes from "ATtention") that's configured modems since the 1980s, where a command like `ATI` reports the modem's status and numbered `ATS`-prefixed commands read or set individual parameters. On the RFD900, sending a `+++` sequence over the link drops it into command mode, changes get written with `AT&W`, and a reboot (`ATZ`) applies them.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/rfd900-gui-tool.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/rfd900-gui-tool.png" | relative_url }}" alt="RFDesign's RFD SiK configuration tool, showing the RFD900P's settings: baud, air speed, frequency range, channel count, transmit power, and more">
    </a>
    <figcaption>RFDesign's own configuration tool, every parameter in one form</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/rfd900-at-commands-terminal.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/rfd900-at-commands-terminal.png" | relative_url }}" alt="A PuTTY serial terminal session sending AT commands to the modem, listing its current parameters via ATI5">
    </a>
    <figcaption>The same settings, read directly over a serial terminal with AT commands</figcaption>
  </figure>
</div>

On Linux that's done through a serial terminal program like Minicom; on Windows it's a dedicated serial terminal rather than PowerShell directly, though because it's just plain text over a serial connection, a short script opening the same port could send identical commands. That's the real takeaway: tuning the radio is nothing more than text down a serial line, which means a companion computer, or the flight controller itself, could eventually retune the link automatically in flight rather than needing someone at a laptop with the GUI tool open.

## A modular, glue-free avionics bay

Wherever possible, I avoided gluing any avionics component directly to the airframe. Glue is a permanent fix to what is, at this stage, still an iterative design: the avionics suite is going to keep growing and changing as the project moves from maiden flight through tuning and into the companion-computer phase, and every glued-down module is damage to the airframe that has to be undone, or lived with, the next time something changes. Instead I designed a custom 3D-printed avionics bay that mounts the flight controller, GPS modules, telemetry radio, and power module mechanically, with no adhesive anywhere. That keeps the whole suite modular: a future sensor or companion computer can be added, and an existing module swapped or repositioned, by adjusting or reprinting the bay rather than cutting into the airframe.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/avionics-bay-initial-design.jpg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/avionics-bay-initial-design.jpg" | relative_url }}" alt="An early avionics mounting design: the RFD900 modem, a power distribution board, and a GPS module mounted on a flat bracket, no airframe yet">
    </a>
    <figcaption>An early mounting layout, worked out on the bench before committing to the printed bay design</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/avionics-bay-empty.jpg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/avionics-bay-empty.jpg" | relative_url }}" alt="The empty avionics bay built into the airframe, before any avionics are installed, with the tail antenna feed-through already in place">
    </a>
    <figcaption>The bay built into the airframe, ready for the avionics to go in</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/avionics-bay-current.jpg" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/avionics-bay-current.jpg" | relative_url }}" alt="The current avionics bay inside the airframe, labelled: flight computer (Pixhawk 6X), long range modem, radio receiver, and GPS 1">
    </a>
    <figcaption>The current bay, fitted in the airframe, with the flight computer, telemetry modem, receiver, and primary GPS all mechanically mounted</figcaption>
  </figure>
</div>

## A custom mount for the RFD900's antennas

The RFD900x itself sits inside the avionics bay, but its two antennas couldn't stay in there with it. At 900MHz the antennas are physically long, too long to fit cleanly inside the airframe while keeping them properly orthogonal, the perpendicular spacing that gives a diversity link its actual benefit by covering for whichever antenna's polarisation happens to be in a null at any given moment. Mounting them inside the bay also put a 900MHz transmitter uncomfortably close to the rest of the avionics, a real interference risk for sensitive equipment like the GPS receivers sitting right next to it. I designed a custom mount that moves both antennas outside the avionics bay, keeping them properly orthogonal to each other and putting real distance between the transmitter and the rest of the electronics.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/antenna-mount-cad-design.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/antenna-mount-cad-design.png" | relative_url }}" alt="CAD render of the custom antenna mount: a knurled, threaded bulkhead fitting on a mounting bracket">
    </a>
    <figcaption>The custom mount, designed in CAD as a knurled, threaded bulkhead fitting</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/external-antenna-and-sensor-mount.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/external-antenna-and-sensor-mount.png" | relative_url }}" alt="Rear view of the Believer airframe, showing the externally-mounted telemetry antenna and the GPS/magnetometer mast on top of the fuselage">
    </a>
    <figcaption>The externally-mounted telemetry antenna and the GPS/magnetometer mast, both kept clear of the avionics bay</figcaption>
  </figure>
</div>

## Commissioning the aircraft in QGroundControl

Beyond wiring up the individual interfaces above, getting Believer flight-ready means working through PX4's full setup sequence in QGroundControl: selecting the airframe type, configuring the power module so the battery's cell count and voltage and current readings calibrate correctly, binding and verifying the RC receiver link, mapping every actuator output to its physical control surface or motor with the right direction, range, and trim, and setting up the motor outputs. Sensor calibration (accelerometer, gyroscope, compass, and airspeed) and a full RC and failsafe check follow before the aircraft is considered safe to fly. None of this is a one-off: per the project's own build checklist, the aircraft gets reconfigured and re-verified from scratch before each test flight rather than trusting a configuration that was last checked weeks earlier, which is exactly the kind of detail worth logging in the parameter change log above rather than re-discovering by trial and error each time.

**Outcome:** establishing a redundant RC control link was the near-term goal in the original project proposal, and it's now done. Most of the maiden-flight build checklist is complete too: airframe, avionics mounting, pitot and magnetometer installation, antenna placement, and a parachute bay repair are all finished. What's left is mostly cosmetic (paint) and procedural (a final configuration and tuning pass, with a build log to document it), aside from one real hardware blocker: the RTK GPS module still needs its antenna fitted before centimetre-level positioning can come online. Flight controller tuning and expanded flight testing are next, with a companion computer and camera payload for onboard object detection planned further out.

## Building a second brain for the project

Believer's documentation is run as a second brain for the project: a private GitHub repo treated as its actual operating record rather than an afterthought, holding the project outline, interface control document, flight manual, purchase and spending history, component datasheets, and photos, alongside the PX4 parameter change log, with radio remote filesystem backups and ground station code planned to join it as those come online. I write and maintain it with AI assistance, working from a `context` folder of standing directives and project notes that gets read at the start of every session, so the documentation conventions and the project's accumulated facts carry across into a brand-new AI session rather than living only inside one chat history.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/context-folder-structure.png" | relative_url }}">
    <img src="{{ "/assets/img/believer-fixed-wing/context-folder-structure.png" | relative_url }}" alt="The Believer project's context folder: standing directives, project notes, and a running change log, plus a supporting-document archive">
  </a>
  <figcaption>Believer's context folder: standing directives, project notes, and a running change log, alongside a supporting document archive</figcaption>
</figure>

That portability is the actual point, not speed for its own sake, though the speed is real too. The same standing directives that keep the documentation consistent also keep it honest: the AI is told explicitly to mark anything unconfirmed as TBD rather than guess, and to flag a judgment call rather than quietly make one. Every change to a parameter, a purchased part, or an interface definition gets logged with its reasoning at the time it happens, not reconstructed from memory weeks later, which is exactly how the PM06 V2 rejection and the ELRS channel remap above ended up as timestamped, reasoned entries in the project's own changelog and parameter log rather than half-remembered later. Used this way, AI assistance doesn't trade traceability for pace, it improves both at once, and that matters more on a project whose documentation people will eventually rely on to fly the aircraft safely.

## Gallery

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/believer-fixed-wing/actuator-output-config.png" | relative_url }}">
      <img src="{{ "/assets/img/believer-fixed-wing/actuator-output-config.png" | relative_url }}" alt="PX4 actuator output configuration screen, showing the six PWM channels mapped to the V-tail, ailerons, and motors">
    </a>
    <figcaption>PX4 actuator output configuration: six PWM channels mapped to the V-tail, ailerons, and motors</figcaption>
  </figure>
</div>
