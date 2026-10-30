---
title: RTTTL Quad Lab
description: A browser-based multi-motor melody studio for composing and previewing Bluejay ESC startup tunes. Runs live on its project page.
category: personal
status: "In progress"
thumbnail: /assets/img/rtttl-quad-lab/app-overview.png
skills:
  - JavaScript
  - Web Audio API
  - MIDI
  - ESC Configuration
  - FPV
---

## Project overview

Bluejay ESC firmware can play a startup tune through each motor, and because every ESC takes its own melody, a quad's four motors can play four separate parts at once. The format is RTTTL (the old Nokia ringtone language), each ESC is monophonic, and each melody is capped at about 62 notes and rests. The existing tools preview one RTTTL string at a time, so there was no way to hear a four-motor arrangement before flashing it.

RTTTL Quad Lab fills that gap: a self-contained studio that plays 4 to 12 motor channels in sync, with a piano-roll editor, MIDI import and export, reference-audio alignment, in-browser pitch detection, and a Bluejay compatibility check. It started as a way to arrange the "Owner of a Lonely Heart" hook for my quad and grew into a general tool. It is plain HTML and JavaScript with no server, so the app below is the real thing, running in your browser.

I set the requirements and directed the design through iterative testing and review, with ChatGPT as the coding assistant. Development now continues in this site's repository.

<div class="app-embed">
  <iframe src="{{ "/apps/rtttl-quad-lab/" | relative_url }}" title="RTTTL Quad Lab, live app"></iframe>
</div>
<p class="app-embed-note">Press <strong>Play all motors</strong> to start audio. Edits are saved in your browser; use Export project to keep a copy. <a href="{{ "/apps/rtttl-quad-lab/" | relative_url }}">Open full screen</a></p>

## System architecture

Everything runs client-side. The browser's Web Audio API turns each note into an oscillator at the right frequency and start time, and mixes one voice per motor into a small multi-channel synthesiser.

| Component | Role |
|---|---|
| `index.html` | Interface, RTTTL parser and encoder, timeline and piano roll, Web Audio synthesis |
| `midi.js` | Dependency-free Standard MIDI File reader and writer |
| `pitch-model.js` | Spotify's Basic Pitch model and TensorFlow.js, bundled locally and loaded only on demand |
| Browser storage and JSON export | Autosave of melodies, channel names and settings; portable project files |

## Getting the rhythm right

The first four-part arrangement repeated the chorus several times and spaced the notes evenly, and it did not sound like the song. Referencing a published chorus transcription showed why: the seven-note hook (E E E G G A A) has an uneven rhythm, not a run of equal eighth notes. I cut the arrangement back to a single phrase with the corrected durations, and all four channels now finish together at 2.4 seconds.

That episode set the direction for the editor. Typing durations into RTTTL text is a slow way to fine-tune timing, so the app gained a piano roll where notes can be dragged for pitch and start time and resized for length, kept in two-way sync with each motor's RTTTL string. A target-time marker shows how an arrangement compares against a set duration.

## Designing around Bluejay's limits

Every feature has to respect what the ESC can actually play. A per-channel preflight check reports event count, frequency range, duration and tempo against Bluejay's limits. MIDI import maps each MIDI voice to one ESC and keeps it monophonic: overlapping notes are moved later, out-of-range notes are transposed by octaves, tempo changes are flattened to the single BPM an RTTTL string allows, and a voice that would exceed 62 events is rejected rather than silently truncated.

## From a recording to RTTTL

To speed up transcription, the app can load an MP3 or WAV, select a clip of up to 20 seconds on its waveform, and run Spotify's open-source Basic Pitch model on it, entirely in the browser. Detected notes appear as dashed suggestions over the piano roll rather than edits, so existing work is never overwritten until the suggestions are explicitly applied to a chosen motor (with undo). Sensitivity, pitch range and minimum note length re-filter the stored result without re-running the model. The model weights are embedded in a script file so the app also works when opened offline from a local file. Detection is most reliable on an isolated voice or instrument; a full mix produces extra notes from the accompaniment, so it is a starting point for manual editing, not a finished transcription.

## Next phase

Flash the arrangement to the quad's ESCs and compare the real motors against the browser preview, then keep developing the app here, starting with splitting the single HTML file into separate modules for the parser, audio engine and editor.
