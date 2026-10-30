# RTTTL Quad Lab

A self-contained, browser-based **4–12-channel** RTTTL melody editor for previewing Bluejay ESC startup tunes (four channels by default). Each motor has its own RTTTL string, editable channel name, mute/solo and preview controls. The synchronized overview and piano-roll editor let you adjust pitch, start time, and duration. A configurable target-time marker appears on both timelines.

No Python, Node.js, build step, application server, internet connection, or paid domain is required to **run** this project (the optional example-song library is the one feature that goes online, see below). The runtime consists of `index.html`, `midi.js`, and `pitch-model.js` together in this folder. The bundled pitch model and TensorFlow.js engine are included locally; they are loaded only when you click **Detect notes**.

## Where it runs

Hosted as part of my portfolio site at https://www.julianw.io/apps/rtttl-quad-lab/ (source: `apps/rtttl-quad-lab/` in the portfolio repo). Pushing to `main` redeploys it with the rest of the site; Jekyll copies these files through untouched because `index.html` has no front matter, and the developer-only files are excluded in `_config.yml`.

## Run locally

1. Open `index.html` directly in Chrome, Edge, Firefox, or Safari. Keep `index.html`, `midi.js` and `pitch-model.js` together.
2. Click **Play all motors** to activate browser audio.

The model is packaged into `pitch-model.js` specifically to avoid browser security restrictions on loading local model files over `file://`.

The app stores edits, motor count and channel names in your browser's local storage. Browsers can treat storage for local `file://` pages differently; use **Export project** to keep a portable backup. **Import project** restores 4–12 RTTTL strings, channel names, target-time marker, tempo, time signature and synthesizer settings from a `.json` file. Older four-motor project files remain compatible. Reference audio bytes and pitch-analysis suggestions are not included in that JSON: load the audio file and detect again on the destination device.

## Editing and saving

- Set **Motors** to any number between 4 and 12, or use the **+ Motor** and **− Motor** buttons. The first four channels default to Higher melody, Lower melody, Harmony, Bass. Extra channels start as silent, editable tracks. Reducing the count asks for confirmation when removed tracks contain custom notes or names.
- Rename any channel in its **Motor tracks** panel.
- Change any motor's RTTTL directly, or edit its notes in the piano roll; the views synchronize. The piano roll has its own **Play / Pause** (resumes from where you paused), a back-to-start button, a This motor / All motors choice and a white playhead; click the bar ruler to move the playhead. Clicking a note in the piano roll plays it, dragging it up or down plays each new pitch, and clicking a key on the left plays that pitch.
- When an RTTTL string has errors, every offending note (or header setting such as `b=960`) is highlighted in red inside the text box, and the message underneath explains the first one; click the message to select it.
- Check **Show target-time bar** and enter a target in seconds to compare your arrangement against a duration.
- Set a global **BPM** to change all four RTTTL tempos together; choose a time signature and enable a metronome during playback.
- Turn **Ripple editing** on to push later notes, or leave it off to move/resize notes independently and encode gaps as RTTTL rests. Use Undo/Redo to reverse piano-roll edits.
- Choose Square, Sine or Motor-like audio synthesis and adjust the stereo spread of the four motor voices. Motor-like is a harmonic approximation, not a physical model of your ESC and motor.
- **Load audio** to decode an MP3/WAV locally. The reference section has its own **Play / Pause** over the whole file with a white playhead and time readout: click the waveform to move the playhead, pause on the exact spot, then **Set start here** / **Set end here** to place the selection. Select a segment by dragging the waveform, dragging either yellow edge of an existing selection, or entering start/duration. Zoom with the − / + / Fit clip / Whole file buttons, a trackpad pinch or Ctrl + scroll (zooming in draws the waveform from the raw samples); pan with the bar under the waveform or Shift + scroll. **Trim to selection** discards audio outside the selection (repeatable, with **Undo trim**) so a full song can be whittled down to the section you want. Then and play the clip alone or in sync with the motors. **Alignment** delays the reference clip relative to the ESCs.
- **Detect notes** analyses a selected reference clip (up to 20 seconds) with Spotify's Basic Pitch model entirely in the browser. The green dashed piano-roll rectangles are *suggestions*, not edits. Change **Sensitivity**, **Lowest note**, **Highest note** and **Min. note** to refine them without repeating the costly model inference. Use **Apply to selected ESC** to convert the suggestions into RTTTL on the currently selected motor. The app confirms before replacing the existing melody and preserves Undo. Only one note can play at once per ESC: overlapping suggestions are skipped. A long/dense result may exceed Bluejay's 62-token limit; shorten the clip or raise the minimum note duration.
- **Choose MIDI** to import type 0 or 1 Standard MIDI Files with PPQ timing, map MIDI voices to individual ESCs and quantise notes to the current snap grid; **Export MIDI** writes a four-track SMF.
- Check **Bluejay preflight** for per-channel event count, frequency range, duration, BPM and warnings.
- **Export project** downloads a JSON backup; **Import project** brings the arrangement into another device or browser.
- **Example songs** opens Bluejay's preset melodies (the library ESC Configurator ships, about 100 songs, 1 to 4 tracks each) with a search box. Choosing one replaces the current arrangement after a confirmation. The list is fetched from ESC Configurator's GitHub on first use (AGPL-3.0, not bundled here) and cached in the browser for offline use afterwards. A handful of upstream presets contain typos; they are flagged in the list, and the bad notes are highlighted in each track's text box.
- **Full screen** in the top bar uses the browser's Fullscreen API, both standalone and when embedded in the portfolio page.
- **Reset melodies** restores the original tune while preserving custom channel names and target-time settings.

MIDI import is intentionally monophonic per ESC. Overlapping notes on one imported voice are moved later; notes outside the editor's C3–B7 register are transposed by octaves. More than 62 encoded notes/rests in a voice causes an import error for that mapping. MIDI tempo changes are flattened to the file's initial tempo because each RTTTL string has a single BPM.

### Notes on pitch detection

Spotify [Basic Pitch](https://github.com/spotify/basic-pitch-ts) is an open-source (Apache-2.0) polyphonic audio-to-MIDI model; its source code and pre-trained weights are bundled with attribution. Automatic transcription works best on an isolated instrument or voice. Full commercial recordings contain several instruments, harmonics, percussion and reverb, so expect false positives and timing differences. Quantisation and the monophonic Bluejay format also limit how accurately a recording can be recreated on a motor.

Analysis happens completely on the device. It may take several seconds, particularly on phones. The first click loads the approximately 2.2 MB local model bundle; subsequent sensitivity/range changes reuse the analysis data and do not re-run neural-network inference.

### Rebuilding the pitch bundle (developers only)

The provided static app is already built. If you modify `src/pitch-model.js` or update its dependencies, run:

```bash
npm ci
npm run build:pitch
npm test
```

This regenerates `pitch-model.js`, embedding the model weights for offline use. It is a build-time step only, no Node.js or package installation is necessary for ordinary users.

### Note on hardware

The browser simulates ESC tones; it does not connect to the ESCs. Real Bluejay motor playback sounds different. Observe Bluejay's melody constraints (including its 62-event limit), remove propellers before bench tests, and disable *Sync Startup Music to Multiple ESCs* when applying different tunes to individual ESCs.

## Project structure

```text
index.html                # page, interface, parser, audio synthesis and editor
midi.js                   # dependency-free MIDI file reader/writer
pitch-model.js            # prebuilt offline Basic Pitch + TensorFlow.js bundle (generated)
BASIC_PITCH_LICENSE.txt
src/pitch-model.js        # editable pitch-engine source
scripts/embed-pitch-model.mjs  # embeds packaged model during build
tests/                    # MIDI and pitch-engine tests
package.json              # optional developer build dependencies
README.md                 # instructions
```

The runtime has no external network dependencies apart from the optional example-song list. When embedded in an iframe the app posts its content height to the parent page (`app-embed:height` message) so the host can size the frame without an inner scrollbar.
