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
  - Teamwork
  - Project Management
---

**Task:** as part of a small team, reverse engineer a commercial single-phase grid-connected solar inverter (a 5 kW ABB UNO string inverter), then analytically model and simulate its two power conversion stages to predict efficiency, losses, and thermal performance at real operating points.

**Approach:** the manufacturer's own datasheet gave a first, general picture of the architecture before any teardown: two MPPT DC-DC stages feeding shared bulk capacitors into a DC-AC inverter stage, with a DSP-based control system and grid-interface protection (a residual current monitor, a grid-parallel relay) around it.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/datasheet-block-diagram.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/datasheet-block-diagram.png" | relative_url }}" alt="Manufacturer datasheet block diagram of the inverter: dual MPPT DC-DC stages, bulk capacitors, a DC-AC inverter stage, line filter, grid-parallel relay, and a DSP-based control system">
  </a>
  <figcaption>The manufacturer's own published block diagram of the inverter's architecture</figcaption>
</figure>

I then opened up the physical unit to identify its actual topology and key components: a DC-DC boost stage handling maximum power point tracking, followed by a full-bridge DC-AC inverter stage producing grid-compatible AC output.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg" | relative_url }}" alt="The ABB UNO inverter, closed and opened up to show the internal boost and inverter stages">
  </a>
  <figcaption>The ABB UNO inverter, closed and opened up to show the internal boost and inverter stages</figcaption>
</figure>

Before modelling the unit's actual boost stage, I practiced the same switching-converter simulation technique on a simpler buck converter in LTspice, checking the output settled cleanly and the switching ripple behaved as expected.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/buck-converter-practice-sim.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/buck-converter-practice-sim.png" | relative_url }}" alt="LTspice buck converter schematic and transient simulation, showing the output voltage settling with switching ripple">
  </a>
  <figcaption>A practice buck-converter simulation, building the switching-converter modelling technique used on the inverter's actual boost stage</figcaption>
</figure>

Component values and ratings were derived from datasheets and physical inspection, then verified through hand calculations and both idealised and realistic LTspice simulations (the realistic models included real component parasitics), including checking the boost converter's inductor ripple across its full input current range.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/inductor-ripple-analysis.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/inductor-ripple-analysis.png" | relative_url }}" alt="Boost converter inductor ripple analysis across the input current range">
  </a>
  <figcaption>Boost converter inductor ripple analysis across the input current range</figcaption>
</figure>

The two stages were also combined into one full-system simulation to check the whole power path actually worked end to end, not just each stage in isolation.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/full-system-simulation.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/full-system-simulation.png" | relative_url }}" alt="Combined boost-plus-inverter simulation showing a clean AC output from the PV input">
  </a>
  <figcaption>Combined boost-plus-inverter simulation: clean AC output recovered from the PV input across the full power path</figcaption>
</figure>

A thermal model was also built to check component temperatures stayed within datasheet limits under worst-case conditions.

**Outcome:** the analytical and simulated results agreed closely at both operating points, giving simulated efficiencies of around 98 to 98.6%, in line with the inverter's published peak efficiency of 97.4%. The full-bridge stage's switching harmonics landed where predicted, well clear of the 50 Hz output.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/solar-inverter-reverse-engineering/harmonic-sidebands.png" | relative_url }}">
    <img src="{{ "/assets/img/solar-inverter-reverse-engineering/harmonic-sidebands.png" | relative_url }}" alt="Simulated switching harmonic sidebands of the full-bridge inverter output">
  </a>
  <figcaption>Simulated switching harmonic sidebands of the full-bridge inverter output</figcaption>
</figure>

Thermal analysis confirmed every component stayed within its safe operating temperature even at full rated load.
