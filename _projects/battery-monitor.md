---
title: Battery Monitor
description: An ESP32-based battery current/voltage monitor built to verify the capacity and quality of second-hand battery cells.
category: personal
status: "Completed"
thumbnail: /assets/img/battery-monitor/discharge-test-plot.jpg
skills:
  - Embedded C
  - Microcontrollers
  - Python
  - Op-Amp Design
  - Power Electronics
---

## Project overview

Built while working at Second Life Battery Sales, where part of the job is judging whether a used battery is actually still good enough to resell. That call comes down to real discharge capacity and cell health, not just a quick voltage check, so I built a standalone tool accurate enough to actually base a keep-or-reject decision on. It has two parts: an ESP32-based current/voltage logger, and a multi-point voltage-tap harness for catching cell imbalance. Both are built and working; this project is complete.

## Selected engineering challenges and decisions

**Making the current measurement trustworthy enough to base a decision on.** An ESP32 measures shunt current through an INA240A3 current-sense amplifier (100x gain, across a 0.5mΩ shunt) and streams readings to a PC over serial. A rough current reading is easy, a reading worth rejecting a battery over is not, so the firmware removes its own ADC bias offset on boot (averaging 300 samples before any load is connected), refuses to recalibrate mid-test via a hard interlock, and estimates its own expected measurement noise from first principles (quantisation noise plus an assumed ADC noise floor). This mattered because a keep-or-reject call is only as good as the number behind it, and a number that can silently drift from an untimely recalibration isn't one worth trusting.

**Catching cell imbalance a single voltage reading would miss.** Total pack voltage alone can hide a problem: a pack can read a perfectly reasonable voltage overall while one cell group inside it is already weak, exactly the kind of defect that matters when judging a used pack. I designed an op-amp buffered voltage-tap harness, a resistor divider and a dedicated op-amp buffer for each of several tap points along the battery string (roughly 8V up to 28V), so the same ADC can read voltage at multiple points during charge and discharge, not just the terminal voltage. Buffering each tap before the ADC keeps the divider's loading independent of whatever else is connected downstream, so the monitoring circuit doesn't itself disturb the voltage it's measuring.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/battery-monitor/voltage-tap-harness-schematic.jpg" | relative_url }}">
    <img src="{{ "/assets/img/battery-monitor/voltage-tap-harness-schematic.jpg" | relative_url }}" alt="Schematic of the voltage tap harness: a resistor divider and op-amp buffer for each battery voltage tap, feeding separate ADC channels">
  </a>
  <figcaption>The voltage tap harness: a buffered resistor divider per tap point, each feeding its own ADC channel</figcaption>
</figure>

## Verification or evidence

A Python application on the PC side talks to the ESP32 over serial: it plots the live discharge current as it happens, integrates it into a running amp-hour total, and logs every reading to a timestamped CSV file. The plot below is a real logged discharge test, not a mock-up, including the brief drops where the load was toggled during testing.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/battery-monitor/discharge-test-plot.jpg" | relative_url }}">
    <img src="{{ "/assets/img/battery-monitor/discharge-test-plot.jpg" | relative_url }}" alt="The Python logger's live plot of discharge current versus elapsed time, alongside the running amp-hour total and raw serial output">
  </a>
  <figcaption>A real logged discharge test: live current plot, running amp-hour total, and raw serial output</figcaption>
</figure>

## Current status

**Completed:** a working two-part monitoring system, a calibrated ESP32 current logger with a real, validated discharge test behind it, and a multi-point voltage tap harness. Both pieces are built and used in practice, not prototypes sitting on a shelf.

## What I learned or am proud of

The voltage-tap harness came out of a specific realisation: a single good-looking number (terminal voltage) can hide exactly the problem you're trying to catch. That's a habit I now apply more broadly, before trusting a single measurement to drive a decision, ask what it could be hiding and whether a second, differently-positioned measurement would catch it.

Code: [github.com/SpicyTenderloin/battery_monitor](https://github.com/SpicyTenderloin/battery_monitor)
