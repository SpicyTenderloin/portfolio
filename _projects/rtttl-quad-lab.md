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

RTTTL Quad Lab fills that gap: a self-contained studio that plays 4 to 12 motor channels in sync, with a piano-roll editor, a one-click library of Bluejay's example songs, MIDI import and export, reference-audio alignment, in-browser pitch detection, a preview of the ESCs' arming beeps, and a Bluejay compatibility check. It started as a way to arrange the "Owner of a Lonely Heart" hook for my quad and grew into a general tool. It is plain HTML and JavaScript with no server, so the app below is the real thing, running in your browser.

I set the requirements and directed the design through iterative testing and review, with ChatGPT as the coding assistant for the first version and Claude Code since development moved into this site's repository.

<div class="app-embed">
  <iframe src="{{ "/apps/rtttl-quad-lab/" | relative_url }}" title="RTTTL Quad Lab, live app" allow="fullscreen" allowfullscreen></iframe>
</div>
<p class="app-embed-note">Press <strong>Play all motors</strong> to start audio, or pick one of Bluejay's <strong>Example songs</strong>. Use <strong>Full screen</strong> in the app's top bar for more room. Edits are saved in your browser; use Export project to keep a copy. <a href="{{ "/apps/rtttl-quad-lab/" | relative_url }}">Open in its own tab</a></p>

## System architecture

Everything runs client-side. The browser's Web Audio API turns each note into an oscillator at the right frequency and start time, and mixes one voice per motor into a small multi-channel synthesiser.

| Component | Role |
|---|---|
| `index.html` | Interface, RTTTL parser and encoder, timeline and piano roll, Web Audio synthesis |
| `midi.js` | Dependency-free Standard MIDI File reader and writer |
| `pitch-model.js` | Spotify's Basic Pitch model and TensorFlow.js, bundled locally and loaded only on demand |
| Browser storage and JSON export | Autosave of melodies, channel names and settings; portable project files |

## Getting the rhythm right

The first four-part arrangement repeated the chorus several times and spaced the notes evenly, and it did not sound like the song. Referencing a published chorus transcription showed why: the seven-note hook (E E E G G A A) has an uneven rhythm, not a run of equal eighth notes. I cut the arrangement back to a single phrase with the corrected durations, and all four channels finished together at 2.4 seconds.

That episode set the direction for the editor. Typing durations into RTTTL text is a slow way to fine-tune timing, so the app gained a piano roll where notes can be dragged for pitch and start time and resized for length, kept in two-way sync with each motor's RTTTL string. A target-time marker shows how an arrangement compares against a set duration. The app's current default song, an Owner of a Lonely Heart riff with root, fifth and octave channels plus a fourth channel of short blips used as percussion, was arranged in that piano roll.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/rtttl-quad-lab/piano-roll.png" | relative_url }}">
    <img src="{{ "/assets/img/rtttl-quad-lab/piano-roll.png" | relative_url }}" alt="RTTTL Quad Lab piano roll editing the Root channel, with the Perfect Fifth, Octave and Percussion channels overlaid as faded notes on a bar and beat grid">
  </a>
  <figcaption>The piano roll editing one ESC with the other three overlaid. Every drag rewrites that motor's RTTTL string.</figcaption>
</figure>

## Designing around Bluejay's limits

Every feature has to respect what the ESC can actually play. A per-channel preflight check reports slot use, frequency range, duration and tempo against Bluejay's limits. The 62-note limit turned out to be 62 storage slots, where a long note or rest takes several, so the app now counts slots exactly as ESC Configurator's converter does, checked against every one of Bluejay's example songs. MIDI import maps each MIDI voice to one ESC and keeps it monophonic: overlapping notes are moved later, out-of-range notes are transposed by octaves, tempo changes are flattened to the single BPM an RTTTL string allows, and a voice that would not fit in the 62 slots is rejected rather than silently truncated.

## Making four ESCs finish together

Each ESC plays its own melody and then carries on with its startup on its own clock, so a channel that finishes early starts its arming beeps while the others are still playing. That is real firmware behaviour, and it showed up in the preview as Bluejay beeps cutting into the riff. The fix was to treat the end pause as one song-wide setting: the app finds the channel that makes noise last, works out where the song should end (the next bar, the next quarter bar, or a custom length such as 5 × 1/4), and gives every channel exactly the rest it needs to stop at that moment.

The preview can then play each firmware's arming beeps after the song, for playback only, never written into the RTTTL. Bluejay's two tones and their timing come from its source (the beep routines' timer values give 492 Hz then 662 Hz, about 61 and 67 ms long), AM32's three-note tune from its prescaler values, and BLHeli_32's from its manual, which is the least exact of the three. An optional setting ends the melody just early enough that the first beep lands on the next beat, so the quad's arming chirp sounds like part of the song. The preflight check reports each channel's padding in slots, since a long rest still costs space in the 62.

<figure>
  <a class="lightbox-trigger" href="{{ "/assets/img/rtttl-quad-lab/tracks-and-preflight.png" | relative_url }}">
    <img src="{{ "/assets/img/rtttl-quad-lab/tracks-and-preflight.png" | relative_url }}" alt="The four motor tracks with their RTTTL strings, above the Bluejay preflight panel reporting slot use, pitch range and end pause for each ESC">
  </a>
  <figcaption>Each motor's RTTTL string, kept in sync with the piano roll, and the preflight check for every ESC.</figcaption>
</figure>

## Faking a slide on a fixed-tone ESC

A guitar riff often slides between notes, but Bluejay can only play fixed tones. It does play them back to back with no gap, though, so a fast run of short notes one semitone apart sounds close to a slide. The Slide tool builds that run in the space before the next note, using 1/32 or 1/64 steps. When there is not room for every semitone it spreads fewer steps evenly across the interval (A3 to B4 in three quarters of a beat becomes a whole-tone run), and the button shows the slot cost before anything changes. 1/64 steps sound smoother, but ESC Configurator drops 64th notes when it reads a melody back off an ESC, so the preflight check flags them.

## From a recording to RTTTL

To speed up transcription, the app can load an MP3 or WAV, select a clip of up to 20 seconds on its waveform, and run Spotify's open-source Basic Pitch model on it, entirely in the browser. Detected notes appear as dashed suggestions over the piano roll rather than edits, so existing work is never overwritten until the suggestions are explicitly applied to a chosen motor (with undo). Sensitivity, pitch range and minimum note length re-filter the stored result without re-running the model. The model weights are embedded in a script file so the app also works when opened offline from a local file. Detection is most reliable on an isolated voice or instrument; a full mix produces extra notes from the accompaniment, so it is a starting point for manual editing, not a finished transcription. To make that workable on a whole song, the waveform view zooms down to individual cycles, the selection edges can be dragged, and the audio can be trimmed to the selection (with undo) to whittle a track down to the section being arranged.

## Next phase

Flash the arrangement to the quad's ESCs and compare the real motors against the browser preview, then keep developing the app here, starting with splitting the single HTML file into separate modules for the parser, audio engine and editor.
