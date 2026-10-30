const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const tf=require('@tensorflow/tfjs');
const {BasicPitch,outputToNotesPoly,noteFramesToTime}=require('@spotify/basic-pitch');

test('offline Basic Pitch graph loads from embedded-style memory and finds an A4 tone',async()=>{
  const dir=path.resolve(__dirname,'../node_modules/@spotify/basic-pitch/model');
  const manifest=JSON.parse(fs.readFileSync(path.join(dir,'model.json'),'utf8'));
  const weights=fs.readFileSync(path.join(dir,manifest.weightsManifest[0].paths[0]));
  const graph=await tf.loadGraphModel(tf.io.fromMemory({
    modelTopology:manifest.modelTopology,
    weightSpecs:manifest.weightsManifest[0].weights,
    weightData:weights.buffer.slice(weights.byteOffset,weights.byteOffset+weights.byteLength)
  }));
  const detector=new BasicPitch(Promise.resolve(graph));
  const hz=440,sr=22050,seconds=1.5;
  const pcm=Float32Array.from({length:Math.round(seconds*sr)},(_,i)=>Math.sin(2*Math.PI*hz*i/sr)*.3);
  const frames=[],onsets=[];
  await detector.evaluateModel(pcm,(f,o)=>{frames.push(...f);onsets.push(...o);},()=>{});
  assert.ok(frames.length>50);
  const peakFrame=Math.max(...frames.map(row=>Math.max(...row)));
  const peakOnset=Math.max(...onsets.map(row=>Math.max(...row)));
  const events=noteFramesToTime(outputToNotesPoly(frames,onsets,.38,.294,9,true,2093,261));
  assert.ok(peakFrame>.5&&peakOnset>.3,'Model should produce confident output on the test tone');
  assert.ok(events.some(n=>n.pitchMidi===69),`Expected A4 (MIDI 69), got ${JSON.stringify(events.slice(0,8))}`);
  graph.dispose();
});
