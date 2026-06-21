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
  - Teamwork
---

**Task:** as part of a small team, design an OFDM (Orthogonal Frequency Division Multiplexing) system to a given set of parameters, then evaluate its performance under realistic wireless channel conditions including multipath fading and noise.

**Approach:** worked through the system's link-level parameters (subcarrier spacing, symbol duration, guard interval, bandwidth) before simulating the system end to end in MATLAB. This included modelling AWGN and Rayleigh fading channels, characterising a multipath channel's power delay profile to check the guard interval was actually long enough to absorb it, measuring bit-error-rate (BER) performance against theoretical curves to validate the simulation, and adding forward error correction (LDPC coding) to recover performance lost to fading.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/orthogonal-subcarriers.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/orthogonal-subcarriers.png" | relative_url }}" alt="Five OFDM subcarriers in the frequency domain, each a sinc-shaped spectrum peaking exactly where every other subcarrier crosses zero">
  </a>
  <figcaption>The core OFDM idea: each subcarrier's spectrum peaks exactly where every other subcarrier crosses zero, so they can overlap without interfering</figcaption>
</figure>

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/channel-power-delay-profile.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/channel-power-delay-profile.png" | relative_url }}" alt="Power delay profile of the multipath channel used for simulation, compared against the guard interval length">
  </a>
  <figcaption>Power delay profile of the multipath channel, plotted against the guard interval to confirm it was long enough to absorb the delay spread</figcaption>
</figure>

## Characterising the channel

Before trusting any BER result from a fading channel simulation, I wanted to be sure the fading model itself was actually correct, not just plausible-looking. A flat Rayleigh fading channel is built from two independent Gaussian random variables treated as the real and imaginary parts of a complex channel gain, and the magnitude of that complex number is supposed to follow a Rayleigh distribution. Rather than taking that on faith, I generated a large number of samples from the simulated channel and compared their histogram against the theoretical Rayleigh probability density function. The close match confirmed the random channel generator was actually producing Rayleigh-distributed fading, not just noise that looked roughly right.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/rayleigh-envelope.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/rayleigh-envelope.png" | relative_url }}" alt="Histogram of simulated fading channel envelope amplitudes overlaid with the theoretical Rayleigh probability density function">
  </a>
  <figcaption>Simulated fading envelope statistics matching the theoretical Rayleigh distribution, validating the channel model before trusting any BER results built on top of it</figcaption>
</figure>

The multipath channel itself was also characterised in the frequency domain. Because the channel's delayed copies arrive with different phases at different frequencies, the channel doesn't attenuate every part of the signal's bandwidth equally, it has a frequency response with peaks and deep nulls across the occupied band. This frequency-selective behaviour is exactly why a single fading coefficient (flat fading) is only a valid simplification when the signal bandwidth is narrow compared to the channel's coherence bandwidth, and why OFDM's narrow subcarriers are useful here: each subcarrier is narrow enough to see a roughly flat slice of an otherwise frequency-selective channel.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/channel-frequency-response.jpg" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/channel-frequency-response.jpg" | relative_url }}" alt="Magnitude of the multipath channel's frequency response across the occupied bandwidth, showing deep frequency-selective nulls">
  </a>
  <figcaption>The multipath channel's frequency response across the occupied bandwidth, the deep nulls are why frequency-selective fading is a real concern and why each OFDM subcarrier needs to be narrow enough to see a roughly flat slice of it</figcaption>
</figure>

**Outcome:** the simulated BER closely tracked theoretical predictions for both AWGN and fading channels, validating the model.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/ber-awgn-vs-fading.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/ber-awgn-vs-fading.png" | relative_url }}" alt="Simulated vs theoretical bit-error-rate for AWGN and fading channels">
  </a>
  <figcaption>Simulated vs theoretical bit-error-rate for AWGN and fading channels</figcaption>
</figure>

Multipath fading clearly degraded raw performance compared to AWGN, but adding LDPC coding recovered a large part of that gap, visibly pulling the coded curve back up toward the AWGN baseline rather than sitting on the uncoded fading curve.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/ber-with-ldpc.png" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/ber-with-ldpc.png" | relative_url }}" alt="Bit-error-rate improvement after adding LDPC forward error correction">
  </a>
  <figcaption>Bit-error-rate improvement after adding LDPC forward error correction</figcaption>
</figure>

The constellation plot below shows the same story visually: a received 64-QAM signal is badly scattered by fading and noise, then pulled back into clean, separable clusters once channel equalisation is applied.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/ofdm-system-design/qam-constellation.jpg" | relative_url }}">
    <img src="{{ "/assets/img/ofdm-system-design/qam-constellation.jpg" | relative_url }}" alt="64-QAM constellation before and after channel equalisation">
  </a>
  <figcaption>64-QAM constellation before and after channel equalisation</figcaption>
</figure>
