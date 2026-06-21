---
title: Digital LQR Maglev Controller
description: Digital control system design for a magnetic levitation module, from QUT's Modern Control unit.
category: university
status: "Completed"
thumbnail: /assets/img/digital-lqr-maglev-controller/maglev-train.jpg
skills:
  - MATLAB
  - Simulink
  - Control Systems
  - State-Space Modelling
  - Kalman Filtering
---

**Task:** design a digital control system to hold a magnetic levitation (maglev) module at a stable height. The system is open-loop unstable and strongly nonlinear, so it has to be actively controlled at all times to stop the levitating carriage from dropping onto the track. The brief called for a fast settling time with very little overshoot, since a real maglev carriage that overshoots risks striking the track.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/maglev-train.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/maglev-train.jpg" | relative_url }}" alt="The Shanghai Transrapid maglev train, an example of the full-scale technology this lab-scale control problem relates to">
  </a>
  <figcaption>The Shanghai Transrapid, a full-scale maglev train (illustrative photo, not the lab-scale module this project actually controlled). Photo: Wikimedia Commons, CC BY-SA 3.0</figcaption>
</figure>

**Approach:** modelled the system's nonlinear dynamics from first principles, then swept the operating range to understand how the power needed to hold the carriage up, and how stiff the dynamics become, both change with height. That sweep is what informed the choice of a practical linearisation point rather than just picking one arbitrarily. From there I designed a discrete-time full-state feedback controller with integral action to meet the settling-time and overshoot spec. Since the real system can only measure position, a Kalman filter observer was layered on top to estimate the remaining states (velocity and coil current) from that single measurement. The full design was validated in Simulink against a realistic nonlinear plant model with sensor noise, process noise, and disturbances included, not just the simplified linear model used for the design itself.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/simulink-model.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/simulink-model.jpg" | relative_url }}" alt="Simulink model of the maglev system used for validation">
  </a>
  <figcaption>Simulink model of the maglev system used for validation</figcaption>
</figure>

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/system-characteristics.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/system-characteristics.jpg" | relative_url }}" alt="Power consumption, pole locations, and stiffness across the operating range, used to choose the linearisation point">
  </a>
  <figcaption>Power consumption, pole locations, and stiffness across the operating range, used to choose where to linearise the system</figcaption>
</figure>

**Outcome:** the controller settled in under two seconds with about 2% overshoot, comfortably inside spec.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/step-response.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/step-response.jpg" | relative_url }}" alt="Closed-loop step response, position and velocity">
  </a>
  <figcaption>Closed-loop step response, position and velocity</figcaption>
</figure>

It also tracked reference heights well beyond the nominal operating point before the nonlinearity broke down the linear model's validity.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/reference-tracking-test.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/reference-tracking-test.jpg" | relative_url }}" alt="Controller tracking a large reference step on the full nonlinear plant">
  </a>
  <figcaption>Tracking a large reference step on the full nonlinear plant, not just the linearised model</figcaption>
</figure>

The controller also successfully rejected a large disturbance impulse (equivalent to a sudden 10kN force on the carriage) without ever letting it contact the track.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/perturbation-response.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/perturbation-response.jpg" | relative_url }}" alt="Controller response to a large disturbance impulse">
  </a>
  <figcaption>Controller response to a large disturbance impulse</figcaption>
</figure>

The observer tracked the true system states closely even with realistic sensor and process noise present, confirming the design was viable for an embedded implementation running at 50Hz.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/digital-lqr-maglev-controller/kalman-filter-performance.jpg" | relative_url }}">
    <img src="{{ "/assets/img/digital-lqr-maglev-controller/kalman-filter-performance.jpg" | relative_url }}" alt="Kalman filter observer tracking the true plant states">
  </a>
  <figcaption>Kalman filter observer tracking the true plant states</figcaption>
</figure>
