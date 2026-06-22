---
title: OFDM System Design
description: Team-designed and simulated OFDM communications system, from QUT's Advanced Telecommunications unit.
category: university
status: "Analytical design study"
thumbnail: /assets/img/ofdm-system-design/orthogonal-subcarriers.png
skills:
  - MATLAB
  - Telecommunications
  - OFDM
  - Channel Modelling
  - Error Correction Coding
---

## Project overview

A small team's task: design an OFDM (Orthogonal Frequency Division Multiplexing) system to a given set of parameters, then evaluate its performance under realistic wireless channel conditions, multipath fading and noise, in MATLAB simulation. This is an analytical study, not a build, the deliverable is a validated simulation of the system, not hardware. The project is complete.

## System architecture

OFDM's core idea is what makes the rest of the design possible: each subcarrier's spectrum is shaped so it peaks exactly where every other subcarrier crosses zero, letting them overlap in frequency without interfering.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/orthogonal-subcarriers.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/orthogonal-subcarriers.png" | relative_url }}" alt="Five OFDM subcarriers in the frequency domain, each a sinc-shaped spectrum peaking exactly where every other subcarrier crosses zero">
  </a>
  <figcaption>The core OFDM idea: each subcarrier's spectrum peaks exactly where every other subcarrier crosses zero</figcaption>
</figure>

The system's link-level parameters, subcarrier spacing, symbol duration, guard interval, and bandwidth, were worked out before simulating the system end to end.

## Selected engineering challenges and decisions

**Validating the channel model before trusting any result built on it.** A flat Rayleigh fading channel is built from two independent Gaussian random variables treated as the real and imaginary parts of a complex channel gain, and the magnitude is supposed to follow a Rayleigh distribution. Rather than take that on faith, I generated a large number of samples from the simulated channel and compared their histogram against the theoretical Rayleigh probability density function, confirming the generator actually produced Rayleigh-distributed fading rather than noise that just looked roughly right. The multipath channel's power delay profile was checked the same way, against the guard interval length, to confirm the guard interval was actually long enough to absorb the channel's delay spread, not just assumed to be. This mattered because every BER result downstream is only as trustworthy as the channel model producing it.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/rayleigh-envelope.png" | relative_url }}">
      <img src="{{ "/assets/img/ofdm-system-design/rayleigh-envelope.png" | relative_url }}" alt="Histogram of simulated fading channel envelope amplitudes overlaid with the theoretical Rayleigh probability density function">
    </a>
    <figcaption>Simulated fading envelope matching the theoretical Rayleigh distribution</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/channel-power-delay-profile.png" | relative_url }}">
      <img src="{{ "/assets/img/ofdm-system-design/channel-power-delay-profile.png" | relative_url }}" alt="Power delay profile of the multipath channel used for simulation, compared against the guard interval length">
    </a>
    <figcaption>Power delay profile checked against the guard interval length</figcaption>
  </figure>
</div>

**Recovering performance lost to fading with forward error correction.** Multipath fading degraded raw bit-error-rate performance well below the AWGN baseline. Adding LDPC coding recovered a large part of that gap, visibly pulling the coded curve back up toward the AWGN baseline rather than leaving it on the uncoded fading curve. This mattered because it's the direct, practical answer to "the channel is degrading performance, what do you actually do about it," not just a description of the degradation.

## Verification or evidence

The simulated BER closely tracked theoretical predictions for both AWGN and fading channels, validating the simulation itself before drawing conclusions from it:

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/ber-awgn-vs-fading.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/ber-awgn-vs-fading.png" | relative_url }}" alt="Simulated vs theoretical bit-error-rate for AWGN and fading channels">
  </a>
  <figcaption>Simulated vs theoretical bit-error-rate for AWGN and fading channels</figcaption>
</figure>

The LDPC improvement and the constellation plot below show the same recovery two ways, numerically and visually: a received 64-QAM signal badly scattered by fading and noise is pulled back into clean, separable clusters once channel equalisation is applied.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/ber-with-ldpc.png" | relative_url }}">
      <img src="{{ "/assets/img/ofdm-system-design/ber-with-ldpc.png" | relative_url }}" alt="Bit-error-rate improvement after adding LDPC forward error correction">
    </a>
    <figcaption>Bit-error-rate improvement after adding LDPC coding</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/qam-constellation.jpg" | relative_url }}">
      <img src="{{ "/assets/img/ofdm-system-design/qam-constellation.jpg" | relative_url }}" alt="64-QAM constellation before and after channel equalisation">
    </a>
    <figcaption>64-QAM constellation before and after channel equalisation</figcaption>
  </figure>
</div>

## Current status

**Completed:** the simulation matches theory across both channel types, and LDPC coding measurably recovers performance lost to fading. This was a closed university assessment; no further development is planned.

## What I learned or am proud of

The habit I'd take from this project: a simulation's results are only as trustworthy as the model producing them, so validate the model's statistical behaviour (the Rayleigh check, the power delay profile against the guard interval) before trusting any performance number built on top of it. Skipping that step doesn't make a simulation wrong, but it does mean you wouldn't actually know if it were.

## Gallery

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/channel-frequency-response.jpg" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/channel-frequency-response.jpg" | relative_url }}" alt="Magnitude of the multipath channel's frequency response across the occupied bandwidth, showing deep frequency-selective nulls">
  </a>
  <figcaption>The multipath channel's frequency response, deep frequency-selective nulls are why each OFDM subcarrier needs to be narrow enough to see a roughly flat slice of it</figcaption>
</figure>
