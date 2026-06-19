---
title: OFDM System Design
description: Team-designed and simulated OFDM communications system, from QUT's Advanced Telecommunications unit.
category: university
thumbnail: /assets/img/ofdm-system-design/qam-constellation.jpg
---

**Task:** as part of a small team, design an OFDM (Orthogonal Frequency Division Multiplexing) system to a given set of parameters, then evaluate its performance under realistic wireless channel conditions including multipath fading and noise.

**Approach:** worked through the system's link-level parameters (subcarrier spacing, symbol duration, guard interval, bandwidth) before simulating the system end to end in MATLAB. This included modelling AWGN and Rayleigh fading channels, measuring bit-error-rate (BER) performance against theoretical curves to validate the simulation, and adding forward error correction (LDPC coding) to recover performance lost to fading.

**Outcome:** the simulated BER closely tracked theoretical predictions for both AWGN and fading channels, validating the model. Multipath fading clearly degraded raw performance compared to AWGN, but adding LDPC coding recovered a large part of that loss, for example reaching a target error rate at a noticeably lower signal-to-noise ratio than the uncoded system. The constellation plots below show the same story visually: a received 64-QAM signal is badly scattered by fading and noise, then pulled back into clean, separable clusters once channel equalisation is applied.

<div class="gallery">
  <img src="{{ "/assets/img/ofdm-system-design/qam-constellation.jpg" | relative_url }}" alt="64-QAM constellation before and after channel equalisation">
  <img src="{{ "/assets/img/ofdm-system-design/ber-awgn-vs-fading.png" | relative_url }}" alt="Simulated vs theoretical bit-error-rate for AWGN and fading channels">
  <img src="{{ "/assets/img/ofdm-system-design/ber-with-ldpc.png" | relative_url }}" alt="Bit-error-rate improvement after adding LDPC forward error correction">
</div>
