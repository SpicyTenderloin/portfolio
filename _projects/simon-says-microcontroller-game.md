---
title: Simon Says Microcontroller Game
description: An embedded implementation of the Simon memory game, from QUT's Microprocessors and Digital Systems unit.
category: university
thumbnail: /assets/img/simon-says-microcontroller-game/quty-board-photo.webp
skills:
  - Embedded C
  - Microcontrollers
  - PlatformIO
  - State Machines
---

**Task:** implement the classic "Simon" memory game from scratch on a microcontroller dev board (QUT's in-house "QUTy" board), driving a 7-segment display and buzzer from four pushbuttons, with the playback speed adjustable via a potentiometer.

**Approach:** wrote bare-metal embedded C firmware structured around clear hardware driver modules: ADC sampling for the potentiometer, button input handling, buzzer tone generation, a timer for game pacing, SPI for driving the 7-segment display, UART for debug output, and a pseudo-random sequence generator for the growing pattern the player has to repeat. Each driver only exposes what the game logic needs (read a button, play a tone, light a segment), so the hardware-facing code stays separate from the game rules. Game logic sat on top as a state machine handling sequence playback, input matching, and scoring, advancing the sequence length each time the player successfully repeats it back and resetting on a wrong input.

<div class="gallery">
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/simon-says-microcontroller-game/quty-board-photo.webp" | relative_url }}">
      <img src="{{ "/assets/img/simon-says-microcontroller-game/quty-board-photo.webp" | relative_url }}" alt="The QUTy board running the Simon Says game, 7-segment display lit up">
    </a>
    <figcaption>The QUTy board running the game</figcaption>
  </figure>
  <figure>
    <a class="lightbox-trigger" href="{{ "/assets/img/simon-says-microcontroller-game/quty-schematic.png" | relative_url }}">
      <img src="{{ "/assets/img/simon-says-microcontroller-game/quty-schematic.png" | relative_url }}" alt="Schematic of the QUTy development board used for this project">
    </a>
    <figcaption>QUTy development board schematic (QUT's own board design, not mine, included as the hardware this firmware targets)</figcaption>
  </figure>
</div>

**Outcome:** a working implementation of the full game loop: an increasingly long sequence of lights and tones that the player has to reproduce, with the game over and high score logic to match.
