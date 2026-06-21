---
title: Audio Signal Visualiser
description: An EESS project giving members hands-on exposure to analog circuit design and embedded systems.
category: club
status: "In progress"
thumbnail: /assets/img/audio-signal-visualiser/AudioSignalVisualiser.jpg
skills:
  - Analog Circuit Design
  - Op-Amp Design
  - Filter Design
  - Embedded Systems
  - Soldering
  - Python
  - PCB Design
---

Launched and lead this project with the Electrical Engineering Student Society (EESS) at QUT, giving members hands-on experience with analog circuit design and embedded systems.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/audio-signal-visualiser/what-is-it-slide.jpg" | relative_url }}">
      <img src="{{ "/assets/img/audio-signal-visualiser/what-is-it-slide.jpg" | relative_url }}" alt="Labelled diagram of the breadboard prototype: electret microphone, signal conditioning filter, microcontroller, and TFT LCD screen showing the live waveform">
    </a>
    <figcaption>What it is: microphone, signal conditioning filter, microcontroller, and live waveform display</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/audio-signal-visualiser/motivation-slide.jpg" | relative_url }}">
      <img src="{{ "/assets/img/audio-signal-visualiser/motivation-slide.jpg" | relative_url }}" alt="Motivation and inspiration slide: contributes to EESS, self-guided and collaborative, engaging interactive demonstrations, accessibility and scalability, signals processing, extends core units, hot-swappable and low-cost">
    </a>
    <figcaption>Why it exists: an engaging, low-cost, hot-swappable demo extending core signals-processing units for EESS members</figcaption>
  </figure>
</div>

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/audio-signal-visualiser/AudioSignalVisualiser.jpg" | relative_url }}">
    <img src="{{ "/assets/img/audio-signal-visualiser/AudioSignalVisualiser.jpg" | relative_url }}" alt="Breadboard prototype showing live audio waveform on the display">
  </a>
  <figcaption>Breadboard prototype showing live audio waveform on the display</figcaption>
</figure>

Beyond the breadboard prototype, I also designed a PCB for the project's signal pre-conditioning stage, the analog front end that conditions an incoming audio signal before it reaches the display.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/audio-signal-visualiser/pcb-render.jpg" | relative_url }}">
    <img src="{{ "/assets/img/audio-signal-visualiser/pcb-render.jpg" | relative_url }}" alt="3D render of the signal pre-conditioning circuit PCB, showing the pre-amp, filter, and final amplifier stages">
  </a>
  <figcaption>3D render of the signal pre-conditioning circuit PCB I designed for the project</figcaption>
</figure>

I also designed a small custom PCB for the project's microphone front end, hand-assembling it with a hot-air reflow station to place and solder the SMD microphone IC.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/audio-signal-visualiser/reflow-microphone-pcb.jpg" | relative_url }}">
    <img src="{{ "/assets/img/audio-signal-visualiser/reflow-microphone-pcb.jpg" | relative_url }}" alt="An SMD microphone IC being reflow-soldered onto the custom microphone PCB using a hot-air rework station">
  </a>
  <figcaption>Reflow-soldering the microphone IC onto the custom microphone PCB</figcaption>
</figure>

## Writing a tool to design the filter stage

Picking real resistor and capacitor values for a multi-stage active filter is normally a tedious, manual process: you work out the ideal pole locations and Q factor for each stage, then hunt through standard component value tables trying to get close to them while keeping the op-amp gain stable. I wrote a Python tool to automate that search. Given a passband and stopband specification, it generates a Chebyshev-I prototype filter, decomposes it into cascaded Sallen-Key stages, then searches real E12, E24, or custom component series for values matching each stage's target frequency and Q factor, checking amplifier stability and calculating the non-inverting gain needed at every stage along the way.

The project's anti-aliasing filter turned out to be a good stress test for the tool: an 8th-order design targeting a 3.5kHz cutoff, where the textbook-ideal Chebyshev decomposition demanded a Q factor of about 18 on one stage, well beyond what a real Sallen-Key stage can realise without becoming unstable. To solve that, I added a stagger-tuning algorithm: a bounded least-squares optimisation that nudges each stage's target frequency slightly (within about ±20%) while keeping every stage's Q inside a safe, realisable range, trading a small amount of frequency accuracy for a design that's actually buildable. The tool outputs an annotated Bode plot and a text report summarising the final component values, transfer functions, and design statistics for every stage.

**Outcome:** a working command-line tool that turns a filter specification into a stable, buildable component list rather than an idealised one a textbook design would give you. It's reusable for any future Sallen-Key filter stage I need to design, not a one-off calculation done by hand each time.
