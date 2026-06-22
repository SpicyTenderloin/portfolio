---
title: Solar Inverter Reverse Engineering Project
description: Reverse engineering and modelling of a commercial grid-connected solar inverter, from QUT's Power Electronics unit.
category: university
status: "Analytical design study"
thumbnail: /assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg
skills:
  - LTspice
  - Power Electronics
  - Thermal Analysis
  - Reverse Engineering
---

## Project overview

A small team's task: reverse engineer a commercial single-phase grid-connected solar inverter (a 5kW ABB UNO string inverter), then analytically model and simulate its two power conversion stages to predict efficiency, losses, and thermal performance at real operating points. This is an analytical study, not a build, the deliverable is a validated model of an existing commercial product, not new hardware. The project is complete and closed.

## System architecture

The manufacturer's own datasheet gave a first, general picture of the architecture before any teardown: two MPPT DC-DC stages feeding shared bulk capacitors into a DC-AC inverter stage, with a DSP-based control system and grid-interface protection (a residual current monitor, a grid-parallel relay) around it.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/datasheet-block-diagram.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/datasheet-block-diagram.png" | relative_url }}" alt="Manufacturer datasheet block diagram of the inverter: dual MPPT DC-DC stages, bulk capacitors, a DC-AC inverter stage, line filter, grid-parallel relay, and a DSP-based control system">
  </a>
  <figcaption>The manufacturer's own published block diagram of the inverter's architecture</figcaption>
</figure>

Opening the physical unit confirmed the actual topology: a DC-DC boost stage handling maximum power point tracking, followed by a full-bridge DC-AC inverter stage producing grid-compatible AC output.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg" | relative_url }}" alt="The ABB UNO inverter, closed and opened up to show the internal boost and inverter stages">
  </a>
  <figcaption>The ABB UNO inverter, closed and opened up to show the internal boost and inverter stages</figcaption>
</figure>

## Selected engineering challenges and decisions

**Explaining efficiency behaviour, not just stating a number.** A single efficiency percentage doesn't say why a converter behaves the way it does across its operating range, so I categorised every loss mechanism in the boost stage by how it scales with current: constant losses (gate drive, off-state leakage, diode reverse-recovery switching), losses linear in current (diode conduction, MOSFET switching), and quadratic losses (inductor and MOSFET conduction, capacitor ESR, all I²R-type losses). This mattered because it turns "the converter is 99% efficient" into an explanation of *why*: at low current, the small constant losses dominate and efficiency is climbing; past a peak, the quadratic I²R terms take over and efficiency falls away again, a real performance trade-off, not a fixed number.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/loss-components-vs-current.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/loss-components-vs-current.png" | relative_url }}" alt="Constant, linear, and quadratic loss components plus total loss plotted against input current, with the customer's specified operating point marked">
  </a>
  <figcaption>Loss components by how they scale with current: constant, linear, and quadratic, with the customer's specified operating point marked</figcaption>
</figure>

At the customer-specified operating point (8A input, 290V in, 400V out), the breakdown is concrete: roughly 1.9W constant, 8.8W linear (diode conduction dominant), and 13.6W quadratic (inductor conduction dominant), for about 24.3W of total loss against 2320W input power. The efficiency curve below shows what that breakdown implies: it peaks around 3.5A and falls on both sides, and the customer's 8A point sits past the peak, on the side where the quadratic terms are starting to dominate.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/efficiency-vs-current.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/efficiency-vs-current.png" | relative_url }}" alt="Converter efficiency plotted against input current, peaking near 3.5A and declining on both sides, with the customer's operating point marked past the peak">
  </a>
  <figcaption>Efficiency peaks near 3.5A and falls on both sides; the customer's operating point sits past the peak</figcaption>
</figure>

## Verification or evidence

Component values and ratings, derived from datasheets and physical inspection, were checked through hand calculations and both idealised and realistic LTspice simulations (the realistic models included real component parasitics). The boost converter's inductor ripple was checked across its full input current range to confirm continuous-conduction-mode operation at the specified point, not the discontinuous mode the analysis assumes:

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/inductor-ripple-analysis.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/inductor-ripple-analysis.png" | relative_url }}" alt="Boost converter inductor ripple analysis across the input current range">
  </a>
  <figcaption>Inductor ripple analysis confirming continuous-conduction-mode operation at the specified point</figcaption>
</figure>

The two stages were also combined into one full-system simulation, to check the whole power path worked end to end rather than just each stage in isolation, and the full-bridge stage's switching harmonics were checked against where the analysis predicted them:

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/full-system-simulation.png" | relative_url }}">
      <img src="{{ "/assets/img/solar-inverter-reverse-engineering/full-system-simulation.png" | relative_url }}" alt="Combined boost-plus-inverter simulation showing a clean AC output from the PV input">
    </a>
    <figcaption>Combined simulation: clean AC output recovered from the PV input across the full power path</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/harmonic-sidebands.png" | relative_url }}">
      <img src="{{ "/assets/img/solar-inverter-reverse-engineering/harmonic-sidebands.png" | relative_url }}" alt="Simulated switching harmonic sidebands of the full-bridge inverter output">
    </a>
    <figcaption>Switching harmonic sidebands landing where predicted, clear of the 50Hz output</figcaption>
  </figure>
</div>

A thermal model also confirmed every component stayed within its safe operating temperature even at full rated load.

## Current status

**Completed:** the analytical and simulated results agreed closely at both operating points, giving simulated efficiencies of around 98 to 98.6%, in line with the inverter's published peak efficiency of 97.4%. This was a closed university assessment; no further development is planned.

## What I learned or am proud of

Categorising losses by how they scale with current, rather than stopping at a single efficiency figure, is what actually explains the converter's behaviour: it shows where the efficiency peak comes from, and why a real operating point chosen for other reasons (the customer's specified 8A) doesn't land on it. That's the transferable habit I'd take into any efficiency analysis, decompose a result into the mechanisms that produce it before treating the headline number as the answer.

## Gallery

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/buck-converter-practice-sim.png" | relative_url }}">
      <img src="{{ "/assets/img/solar-inverter-reverse-engineering/buck-converter-practice-sim.png" | relative_url }}" alt="LTspice buck converter schematic and transient simulation, showing the output voltage settling with switching ripple">
    </a>
    <figcaption>A practice buck-converter simulation, building the switching-converter modelling technique used on the actual boost stage</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/boost-converter-simulation.png" | relative_url }}">
      <img src="{{ "/assets/img/solar-inverter-reverse-engineering/boost-converter-simulation.png" | relative_url }}" alt="An online circuit simulator showing a boost converter schematic with a live output voltage waveform ramping up">
    </a>
    <figcaption>An early boost-converter simulation, checking the output ramps up and settles as expected</figcaption>
  </figure>
</div>
