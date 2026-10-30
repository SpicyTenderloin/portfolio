// Offline, browser-side polyphonic pitch transcription powered by Spotify's
// Basic Pitch (Apache-2.0) and TensorFlow.js; model embedded during build.
import * as tf from '@tensorflow/tfjs';
import {BasicPitch,noteFramesToTime,outputToNotesPoly} from '@spotify/basic-pitch';
import {topology,weightSpecs,weightBase64} from './pitch-embedded.js';

let sharedModel=null;
function model(){
  if(!sharedModel){
    sharedModel=(async()=>{
      await tf.ready();
      const raw=atob(weightBase64),bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
      const loaded=await tf.loadGraphModel(tf.io.fromMemory({modelTopology:topology,weightSpecs,weightData:bytes.buffer}));
      return new BasicPitch(Promise.resolve(loaded));
    })().catch(err=>{sharedModel=null;throw err;});
  }
  return sharedModel;
}

async function detect(samples,onProgress=()=>{}){
  if(!(samples instanceof Float32Array)||!samples.length)throw Error('No audio samples to analyse.');
  const pitch=await model();
  const frames=[],onsets=[],contours=[];
  await pitch.evaluateModel(samples,(f,o,c)=>{
    frames.push(...f);onsets.push(...o);contours.push(...c);
  },percent=>onProgress(Math.round(100*percent)));
  return {frames,onsets,contours};
}

function transcribe(data,{sensitivity=55,minMidi=48,maxMidi=95,minMs=110}={}){
  if(!data)return [];
  const factor=Math.max(0,Math.min(100,Number(sensitivity)))/100;
  const onsetThreshold=.60-factor*.40;
  const frameThreshold=.47-factor*.32;
  const minFrames=Math.max(2,Math.round(minMs/1000*(22050/256)));
  const minFrequency=440*2**((minMidi-69)/12);
  const maxFrequency=440*2**((maxMidi-69)/12);
  // The library zeroes out frequency bins while extracting notes. Work from
  // copies so changing the sensitivity/range does not damage cached frames.
  const frames=data.frames.map(row=>row.slice());
  const onsets=data.onsets.map(row=>row.slice());
  const events=outputToNotesPoly(frames,onsets,onsetThreshold,frameThreshold,minFrames,true,maxFrequency,minFrequency);
  return noteFramesToTime(events).filter(n=>n.pitchMidi>=minMidi&&n.pitchMidi<=maxMidi)
    .map(n=>({start:n.startTimeSeconds,duration:n.durationSeconds,midi:n.pitchMidi,confidence:n.amplitude}))
    .filter(n=>Number.isFinite(n.start)&&n.duration>0).sort((a,b)=>a.start-b.start||b.confidence-a.confidence);
}

window.QuadPitch={detect,transcribe};
