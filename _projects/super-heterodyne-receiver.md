---
title: Super Heterodyne Receiver
description: Team-designed conceptual RF receiver covering a 3 to 5 GHz band, from QUT's Telecommunications and RF unit.
category: university
status: "Analytical design study"
thumbnail: /assets/img/super-heterodyne-receiver/architecture-diagram.png
skills:
  - RF Design
  - MATLAB
  - Link Budget Analysis
  - Mixer Design
  - Filter Design
  - Teamwork
  - Project Management
---

**Task:** as part of a small team, design a super-heterodyne RF receiver covering 3 to 5 GHz against a client-style specification: defined channel bandwidth, image and spurious signal rejection, sensitivity, and signal-to-noise ratio.

**Approach:** the design uses a two-stage down-conversion architecture, mixing the incoming signal down to an intermediate frequency in two steps to balance image rejection against selectivity. The full 3 to 5 GHz band is split into four channels, each with its own preselection filter switched in ahead of the first mixer. My own focus was the conceptual design and the MATLAB analysis underpinning it, specifically choosing the intermediate frequency and modelling the spurious products a real mixer produces, described in more detail below.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/super-heterodyne-receiver/architecture-diagram.png" | relative_url }}">
    <img src="{{ "/assets/img/super-heterodyne-receiver/architecture-diagram.png" | relative_url }}" alt="Super-heterodyne receiver architecture: filter bank, two mixer stages, local oscillators, and IF filters">
  </a>
  <figcaption>Super-heterodyne receiver architecture: filter bank, two mixer stages, local oscillators, and IF filters</figcaption>
</figure>

## Finding the right intermediate frequency

Before any components could be chosen, the design needed an intermediate frequency (IF) that kept the system's two biggest threats, the image band and third-order mixer spurs, as far away from the IF as possible. I wrote a MATLAB script that swept a wide range of candidate IFs and, for each one, calculated how far the image band sat from the desired signal and how close the nearest problematic third-order spur band landed to the IF itself, across every channel in the band. Rather than eyeballing a frequency plan, this turned IF selection into a proper search: the script picked out the candidate that maximised the worst-case distance on both fronts simultaneously, which is what actually drove the final choice of IF used throughout the rest of the design.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/super-heterodyne-receiver/if-sweep.png" | relative_url }}">
    <img src="{{ "/assets/img/super-heterodyne-receiver/if-sweep.png" | relative_url }}" alt="Distance to the image band and distance to the nearest third-order spur band plotted against candidate IF, with the chosen IF marked at the crossover point">
  </a>
  <figcaption>Distance to the image band rises with IF while distance to the nearest spur band falls, the chosen IF sits right at the crossover where the worst-case distance is maximised</figcaption>
</figure>

## Modelling spurious mixer products

A real mixer isn't a perfect multiplier, it produces a forest of unwanted intermodulation products alongside the wanted down-converted signal. I wrote a function that models a mixer's first, second, and third-order products (the familiar family of terms like the difference and sum frequencies, and their second harmonics, that fall out of a nonlinear mixer) given an amplifier's output spectrum and a local oscillator frequency, then plots where every one of them lands relative to the IF. I ran this for the local oscillator at both ends of its tuning range, on every channel, to confirm no spur could ever drift onto the IF and corrupt the down-converted signal, no matter which channel was selected. The plots further down this page, showing first, second, and third-order products spread across the spectrum relative to the IF marker, are the direct output of this analysis.

These two pieces, the IF search and the spurious-product model, are what the rest of the receiver's architecture and component choices were built around.

## Link budget and dynamic range

Beyond keeping spurs and the image away from the IF, the design had to actually deliver a usable signal to the demodulator across a wide range of input strengths. That meant tracking the signal's power stage by stage, from the weakest signal the antenna would ever see down at the receiver's sensitivity limit, through every filter, amplifier, and mixer, checking it never dropped below the noise floor and never grew large enough to saturate a downstream stage. The bandwidth used for that noise floor calculation was deliberately the narrowest filter in the chain (the final IF filter), since that's what actually sets how much thermal noise reaches the detector.

At the other end of the range, the limiting factor turned out to be the detector itself rather than any of the amplifiers or mixers, all of which had far more headroom before reaching their own compression points. To stop a strong input signal from overdriving the detector, an attenuator was placed late in the chain (just ahead of the final amplification stage) rather than at the front end, controlled by an automatic gain control loop that only engages once the signal crosses a threshold. Keeping the early stages un-attenuated preserves sensitivity for weak signals, while the attenuator protects the back end once a signal gets strong, stretching the usable dynamic range without sacrificing either extreme.

**Outcome:** the verified design met every target in the specification: a minimum discernible signal of -98 dBm, output SNR well above the 3 dB demodulator requirement across the full input power range, and a dynamic range of close to 40 dB. The spurious-response analysis confirms the unwanted mixer products stay clear of the intermediate frequency at both ends of the lowest channel's local oscillator tuning range.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/super-heterodyne-receiver/spurs-channel1-max.jpg" | relative_url }}">
      <img src="{{ "/assets/img/super-heterodyne-receiver/spurs-channel1-max.jpg" | relative_url }}" alt="Mixer output spurious products with the local oscillator at its maximum value">
    </a>
    <figcaption>Mixer output spurious products with the local oscillator at its maximum value</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/super-heterodyne-receiver/spurs-channel1-min.jpg" | relative_url }}">
      <img src="{{ "/assets/img/super-heterodyne-receiver/spurs-channel1-min.jpg" | relative_url }}" alt="Mixer output spurious products with the local oscillator at its minimum value">
    </a>
    <figcaption>Mixer output spurious products with the local oscillator at its minimum value</figcaption>
  </figure>
</div>

The same held across the other three channels right up to the top of the band.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/super-heterodyne-receiver/spurs-channel4-max.jpg" | relative_url }}">
    <img src="{{ "/assets/img/super-heterodyne-receiver/spurs-channel4-max.jpg" | relative_url }}" alt="Mixer output spurious products for the top channel, with the local oscillator at its maximum value">
  </a>
  <figcaption>Same analysis repeated for the top channel of the band</figcaption>
</figure>
