---
title: Simon Says Microcontroller Game
description: An embedded implementation of the Simon memory game, from QUT's Microprocessors and Digital Systems unit.
category: university
status: "Completed"
thumbnail: /assets/img/simon-says-microcontroller-game/quty-board-photo.webp
skills:
  - Embedded C
  - Embedded Systems
  - Microcontrollers
  - PlatformIO
  - State Machines
---

**Task:** implement the classic "Simon" memory game from scratch on a microcontroller dev board (QUT's in-house "QUTy" board, built around an ATtiny1626), driving a 7-segment display and buzzer from four pushbuttons, with the playback speed adjustable via a potentiometer. This was a bare-metal assignment: no Arduino-style libraries, no hardware abstraction layer, just the datasheet and the chip's own peripheral registers.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/simon-says-microcontroller-game/quty-schematic.png" | relative_url }}">
    <img src="{{ "/assets/img/simon-says-microcontroller-game/quty-schematic.png" | relative_url }}" alt="Schematic of the QUTy development board used for this project">
  </a>
  <figcaption>QUTy development board schematic (QUT's own board design, not mine, included as the hardware this firmware targets)</figcaption>
</figure>

**Approach:** wrote the firmware as a set of small hardware driver modules (buttons, buzzer, ADC, SPI, UART, timers, sequence generator), each one only exposing what the game logic actually needs (read a button, play a tone, light a segment), so the register-level details stay out of the game rules entirely. The game itself runs as a state machine on top of those drivers.

## Game logic as a state machine

The whole game is one big `switch` statement on a state variable, running inside the firmware's main loop forever. There are ten states in total: a few for the machine's turn (generate the next sequence, set the display, hold it on briefly), a few for the human's turn (waiting for a guess, correct guess, incorrect guess), and a few for the win/lose/high-score flow (display the win pattern, display the loss pattern and score, prompt for a name if it's a new high score). A second, smaller state machine runs in parallel just for the UART serial interface, since the board also accepts commands and a typed name over serial independently of the button presses. Splitting it this way meant the game rules could be reasoned about as "what state am I in, what just happened, what state do I go to next," rather than as a tangle of flags.

## Timers, interrupts, and registers

Two of the chip's hardware timer peripherals are configured directly through their control registers at startup, each driving its own interrupt at a fixed rate. One fires every millisecond and just increments an elapsed-time counter the game logic polls to know when to advance. The other fires every 5 milliseconds and does two jobs at once inside its interrupt handler: it alternates which of the two 7-segment digits is currently being driven over SPI (multiplexing a single SPI output across two displays fast enough that both look constantly lit to the eye), and it runs a debounce pass across all four pushbuttons simultaneously using a small parallel counter trick, rather than debouncing each button with its own separate counter and timer. The main loop itself never touches hardware timing directly, it just reads whatever the interrupts have already updated.

Button presses are turned into clean rising/falling edges by keeping the previous and current debounced button state and XOR-ing them together, a standard way to detect "something just changed" without missing a press that happens to land between two polls of the main loop.

## Output drivers

The buzzer is driven by a third timer configured for PWM: the desired note's frequency is converted into a timer period (clock speed divided by frequency) and the duty cycle fixed at 50%, so changing pitch is just a matter of recalculating and reloading that period register.

## Generating the sequence

The growing pattern the player has to repeat comes from a linear feedback shift register (LFSR): a chain of bits that shifts by one position every step, feeding a few of its own bits back through XOR gates to decide the new bit coming in. It's a deliberate choice for this kind of project, an LFSR needs no multiplication or division and no hardware random-number peripheral, just shifts and XORs, so it sits comfortably within a small microcontroller's resources while still producing a sequence that looks unpredictable.

Rather than storing the sequence as it's generated and keeping that state persistently between turns, the firmware recomputes the nth element of the sequence from scratch each time it's needed, replaying the shift register forward from the seed for n steps. That trades a few extra CPU cycles for a simpler mental model: the whole game state for "what comes next" collapses down to just two numbers, the seed and how far into the sequence play has reached, rather than a separately maintained buffer that could drift out of sync with the rest of the game logic.

The seed itself is tied to my own student number, which is QUT's own anti-collusion mechanism built into the assignment brief: it means two students' boards never play back the same sequence even running identical logic, so the actual answers can't just be shared or memorised from someone else's game. On a loss, that seed is incremented before the next round starts, so replaying the game doesn't just repeat the same pattern from the beginning, each attempt is a genuinely new sequence rather than a memorisable fixed one.

**Outcome:** a working implementation of the full game loop: an increasingly long sequence of lights and tones that the player has to reproduce, with the game over and high score logic to match.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/simon-says-microcontroller-game/quty-board-photo.webp" | relative_url }}">
    <img src="{{ "/assets/img/simon-says-microcontroller-game/quty-board-photo.webp" | relative_url }}" alt="The QUTy board running the Simon Says game, 7-segment display lit up">
  </a>
  <figcaption>The QUTy board running the game</figcaption>
</figure>

I built this before AI-assisted code generation was really a thing, so every register setting, interrupt, and state transition came from reading the datasheet and working it out by hand rather than from a prompt. That's where a lot of my actual feel for how microcontrollers behave came from, and it's still what I lean on now to judge whether AI-generated embedded code is doing something sensible.
