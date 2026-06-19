---
title: Two-Tone Alarm Circuit
description: A two-tone siren circuit designed, simulated, and built from scratch, from QUT's Electronic Design unit.
category: university
thumbnail: /assets/img/two-tone-alarm-circuit/breadboard-prototype.jpg
---

**Task:** design, simulate, and build a battery-powered alarm circuit that produces two distinct audible tones with a flashing LED, meeting a tight power budget and bill-of-materials cost target, manufacturable on a PCB.

**Approach:** built the circuit around a hex Schmitt trigger IC configured as a pair of relaxation oscillators: one slow oscillator controls how often the tone switches, and a transistor switches an extra capacitor in and out of the second oscillator's feedback loop to flip between the two audible frequencies. Component values were calculated from the datasheet's oscillator equations, then refined through LTspice simulation and bench testing, since the real IC behaviour didn't perfectly match the simplified datasheet model. The design was simulated in LTspice before being built and verified on a breadboard with an oscilloscope.

![Breadboard prototype of the two-tone alarm circuit](/assets/img/two-tone-alarm-circuit/breadboard-prototype.jpg)

**Outcome:** the simulated and measured results matched closely. The image below compares the LTspice simulation of the buzzer tone switching (left) against the same point measured on the real circuit with an oscilloscope (right), confirming the design worked as intended on real hardware, not just on paper.

<div class="gallery">
  <img src="{{ "/assets/img/two-tone-alarm-circuit/sim-tone-switching.png" | relative_url }}" alt="LTspice simulation of the buzzer switching between tones">
  <img src="{{ "/assets/img/two-tone-alarm-circuit/scope-tone-switching.png" | relative_url }}" alt="Oscilloscope capture of the buzzer switching between tones on the real circuit">
  <img src="{{ "/assets/img/two-tone-alarm-circuit/sim-control-oscillator.png" | relative_url }}" alt="LTspice simulation of the control oscillator frequency">
  <img src="{{ "/assets/img/two-tone-alarm-circuit/scope-control-oscillator.png" | relative_url }}" alt="Oscilloscope capture of the control oscillator frequency on the real circuit">
</div>
