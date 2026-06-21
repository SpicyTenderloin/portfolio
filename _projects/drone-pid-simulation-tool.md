---
title: Drone PID Simulation Tool
description: An in-progress MATLAB/Simulink teaching tool for QUTAS, letting members interactively explore PID control on a simulated drone.
category: club
status: "In progress"
thumbnail: /assets/img/drone-pid-simulation-tool/pid-model-diagram.png
skills:
  - MATLAB
  - Simulink
  - Control Systems
  - PID Control
---

**Task:** build a teaching tool for QUT Aerospace Society (QUTAS) members to learn Simulink and PID control hands-on, rather than just from theory. This project is still in its early stages.

**Approach:** the tool models a quadcopter's altitude loop as a Simulink block diagram, a reference altitude compared against the actual altitude to get an error signal, fed through a PID controller into a motor/actuator model and then the vehicle's physical dynamics, with the resulting altitude fed back to close the loop. It's paired with a MATLAB Live Script that lets a member interactively adjust the proportional, integral, and derivative gains and immediately see the effect on the simulated drone's step response. The goal is to make the connection between a PID gain and what it actually does to a real (simulated) system immediate and visual, rather than abstract.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/drone-pid-simulation-tool/pid-model-diagram.png" | relative_url }}">
    <img src="{{ "/assets/img/drone-pid-simulation-tool/pid-model-diagram.png" | relative_url }}" alt="The Simulink block diagram: reference altitude compared against actual altitude through a PID controller, actuator/motor model, and plant dynamics, closed with a feedback loop">
  </a>
  <figcaption>The Simulink altitude control loop: PID controller, actuator, and plant dynamics, closed with feedback</figcaption>
</figure>

**Outcome:** currently a working Simulink model plus an interactive Live Script for tuning and visualising step response, the first building block toward a fuller teaching tool for the club. Still early days, more features (additional flight modes, a clearer guided walkthrough for members new to control theory) are planned.

Code: [github.com/SpicyTenderloin/PID_simulation_tool](https://github.com/SpicyTenderloin/PID_simulation_tool)
