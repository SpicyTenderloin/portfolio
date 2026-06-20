---
title: Drone PID Simulation Tool
description: An in-progress MATLAB/Simulink teaching tool for QUTAS, letting members interactively explore PID control on a simulated drone.
category: club
skills:
  - MATLAB
  - Simulink
  - Control Systems
  - PID Control
---

**Task:** build a teaching tool for QUT Aerospace Society (QUTAS) members to learn Simulink and PID control hands-on, rather than just from theory. This project is still in its early stages.

**Approach:** the tool models a quadcopter's attitude and altitude as a Simulink block diagram, paired with a MATLAB Live Script that lets a member interactively adjust the proportional, integral, and derivative gains and immediately see the effect on the simulated drone's step response. The goal is to make the connection between a PID gain and what it actually does to a real (simulated) system immediate and visual, rather than abstract.

**Outcome:** currently a working Simulink model plus an interactive Live Script for tuning and visualising step response, the first building block toward a fuller teaching tool for the club. Still early days, more features (additional flight modes, a clearer guided walkthrough for members new to control theory) are planned.
