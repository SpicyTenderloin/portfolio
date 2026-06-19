---
title: Solar Inverter Reverse Engineering Project
description: Reverse engineering and modelling of a commercial grid-connected solar inverter, from QUT's Power Electronics unit.
category: university
thumbnail: /assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg
---

**Task:** as part of a small team, reverse engineer a commercial single-phase grid-connected solar inverter (a 5 kW ABB UNO string inverter), then analytically model and simulate its two power conversion stages to predict efficiency, losses, and thermal performance at real operating points.

**Approach:** opened up the physical unit to identify its topology and key components: a DC-DC boost stage handling maximum power point tracking, followed by a full-bridge DC-AC inverter stage producing grid-compatible AC output. Component values and ratings were derived from datasheets and physical inspection, then verified through hand calculations and both idealised and realistic LTspice simulations (the realistic models included real component parasitics). A thermal model was also built to check component temperatures stayed within datasheet limits under worst-case conditions.

![The ABB UNO inverter, closed and opened up to show the internal boost and inverter stages](/assets/img/solar-inverter-reverse-engineering/teardown-photo.jpg)

**Outcome:** the analytical and simulated results agreed closely at both operating points, giving simulated efficiencies of around 98 to 98.6%, in line with the inverter's published peak efficiency of 97.4%. The full-bridge stage's switching harmonics landed where predicted, well clear of the 50 Hz output, and thermal analysis confirmed every component stayed within its safe operating temperature even at full rated load.

<div class="gallery">
  <img src="{{ "/assets/img/solar-inverter-reverse-engineering/inductor-ripple-analysis.png" | relative_url }}" alt="Boost converter inductor ripple analysis across the input current range">
  <img src="{{ "/assets/img/solar-inverter-reverse-engineering/harmonic-sidebands.png" | relative_url }}" alt="Simulated switching harmonic sidebands of the full-bridge inverter output">
</div>
