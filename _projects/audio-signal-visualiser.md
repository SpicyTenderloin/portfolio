---
title: Audio Signal Visualiser
description: An EESS project giving members hands-on exposure to analog circuit design and embedded systems.
category: club
thumbnail: /assets/img/audio-signal-visualiser/AudioSignalVisualiser.jpg
skills:
  - Analog Circuit Design
  - Op-Amp Design
  - Filter Design
  - Embedded Systems
  - Soldering
  - Python
gallery:
  - src: /assets/img/audio-signal-visualiser/AudioSignalVisualiser.jpg
    caption: "Breadboard prototype showing live audio waveform on the display"
---

Launched and lead this project with the Electrical Engineering Student Society (EESS) at QUT, giving members hands-on experience with analog circuit design and embedded systems.

Beyond the breadboard prototype, I also designed a PCB for the project's signal pre-conditioning stage, the analog front end that conditions an incoming audio signal before it reaches the display.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/audio-signal-visualiser/pcb-render.jpg" | relative_url }}">
    <img src="{{ "/assets/img/audio-signal-visualiser/pcb-render.jpg" | relative_url }}" alt="3D render of the signal pre-conditioning circuit PCB, showing the pre-amp, filter, and final amplifier stages">
  </a>
  <figcaption>3D render of the signal pre-conditioning circuit PCB I designed for the project</figcaption>
</figure>

## Writing a tool to design the filter stage

Picking real resistor and capacitor values for a multi-stage active filter is normally a tedious, manual process: you work out the ideal pole locations and Q factor for each stage, then hunt through standard component value tables trying to get close to them while keeping the op-amp gain stable. I wrote a Python tool to automate that search. Given a passband and stopband specification, it generates a Chebyshev or Butterworth prototype filter, splits it into cascaded Sallen-Key biquad stages, then brute-force searches real E12/E24 resistor and capacitor values for each stage, scoring every candidate combination on how closely it reproduces the target frequency and Q factor while respecting the amplifier's gain stability limit. The result is an automatically generated bill of materials for a filter that's actually buildable with off-the-shelf parts, rather than the idealised component values a textbook design gives you.

**Outcome:** a working command-line tool that takes a filter specification and outputs a buildable component list, a Bode plot comparing the ideal and realised response, and a saved JSON record of the design. It's reusable for any future Sallen-Key filter stage I need to design, rather than being a one-off calculation done by hand each time.
