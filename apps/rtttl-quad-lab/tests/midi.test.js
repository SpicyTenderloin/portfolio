const test=require('node:test');
const assert=require('node:assert/strict');
const {read,write}=require('../midi.js');

test('MIDI type 1 round-trip retains notes, tempo and meter',()=>{
  const voices=[
    {name:'Higher melody',notes:[{start:0,duration:.5,midi:76},{start:.75,duration:1.5,midi:79}]},
    {name:'Bass',notes:[{start:0,duration:3,midi:52}]}
  ];
  const bytes=write(voices,125,{num:6,den:8});
  const result=read(bytes);
  assert.equal(result.format,1);
  assert.equal(result.bpm,125);
  assert.deepEqual(result.signature,{num:6,den:8});
  assert.equal(result.voices.length,2);
  assert.equal(result.voices[0].notes.length,2);
  assert.deepEqual(result.voices[0].notes.map(x=>[x.startTick,x.endTick,x.midi]),[[0,240,76],[360,1080,79]]);
  assert.equal(result.voices[1].notes[0].midi,52);
});

test('MIDI track names and independent channel voices are exposed',()=>{
  const bytes=write([
    {name:'Upper register',notes:[{start:0,duration:.25,midi:81}]},
    {name:'Lower register',notes:[{start:0,duration:.5,midi:57}]}
  ],92,{num:4,den:4});
  const parsed=read(bytes);
  assert.equal(parsed.voices[0].name,'Upper register · CH 1');
  assert.equal(parsed.voices[1].name,'Lower register · CH 2');
  assert.ok(Math.abs(parsed.bpm-92)<=1);
});

test('Invalid headers and unsupported timing divisions fail safely',()=>{
  assert.throws(()=>read(new Uint8Array([1,2,3,4,5,6])),/Not a Standard MIDI File/);
  const bytes=write([],120);
  bytes[12]=0x80;
  assert.throws(()=>read(bytes),/Only MIDI type 0\/1 with PPQ timing/);
});
