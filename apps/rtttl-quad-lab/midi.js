/* Standard MIDI File reader/writer. No dependencies, works from file://. */
(() => {
  'use strict';

  function read(bytes) {
    const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
    const view=new DataView(data.buffer,data.byteOffset,data.byteLength);
    let at=0;
    const requireBytes=n=>{if(at+n>data.length)throw Error('Truncated MIDI file');};
    const u8=()=>{requireBytes(1);return data[at++];};
    const u16=()=>{requireBytes(2);const v=view.getUint16(at);at+=2;return v;};
    const u32=()=>{requireBytes(4);const v=view.getUint32(at);at+=4;return v;};
    const str=n=>{requireBytes(n);let s='';for(let i=0;i<n;i++)s+=String.fromCharCode(data[at++]);return s;};
    const vlq=()=>{let n=0;for(let i=0;i<4;i++){const b=u8();n=(n<<7)|(b&127);if(!(b&128))return n;}throw Error('Invalid MIDI variable length value');};
    if(str(4)!=='MThd')throw Error('Not a Standard MIDI File');
    const headerLength=u32();if(headerLength<6)throw Error('Invalid MIDI header');
    const format=u16(),count=u16(),division=u16();
    if(format>1||division&0x8000||!division)throw Error('Only MIDI type 0/1 with PPQ timing is supported');
    if(count>256)throw Error('Unreasonable MIDI track count');
    at+=headerLength-6;requireBytes(0);
    const tracks=[],tempos=[],signatures=[];
    const decoder=new TextDecoder();
    for(let ti=0;ti<count;ti++){
      if(str(4)!=='MTrk')throw Error('Missing MIDI track chunk');
      const trackLen=u32(),end=at+trackLen;requireBytes(trackLen);
      let tick=0,running=0,name=`Track ${ti+1}`;
      const notes=[],active=new Map();
      while(at<end){
        tick+=vlq();let status=u8();
        if(status<0x80){if(!running)throw Error('Invalid MIDI running status');at--;status=running;}
        if(status===0xff){
          const type=u8(),n=vlq();requireBytes(n);
          const start=at;
          if(type===0x03)name=decoder.decode(data.slice(at,at+n)).slice(0,80);
          if(type===0x51&&n===3)tempos.push({tick,us:(data[at]<<16)|(data[at+1]<<8)|data[at+2]});
          if(type===0x58&&n>=2)signatures.push({tick,num:data[at],den:2**data[at+1]});
          at=start+n;running=0;continue;
        }
        if(status===0xf0||status===0xf7){const n=vlq();requireBytes(n);at+=n;running=0;continue;}
        if(status>=0xf0)throw Error('Unsupported MIDI system event');
        running=status;
        const kind=status&0xf0,ch=status&0x0f,a=u8(),b=(kind===0xc0||kind===0xd0)?0:u8();
        if(kind!==0x80&&kind!==0x90)continue;
        const key=`${ch}:${a}`;
        if(kind===0x90&&b>0){
          if(!active.has(key))active.set(key,[]);
          active.get(key).push(tick);
        }else{
          const stack=active.get(key);if(stack?.length){const start=stack.shift();if(tick>start)notes.push({startTick:start,endTick:tick,midi:a,channel:ch});}
        }
      }
      at=end;tracks.push({name,notes});
    }
    const bpm=Math.round(60000000/(tempos.sort((a,b)=>a.tick-b.tick)[0]?.us||500000));
    const signature=signatures.sort((a,b)=>a.tick-b.tick)[0]||{num:4,den:4};
    const voices=[];
    tracks.forEach((track,ti)=>{
      const channels=[...new Set(track.notes.map(n=>n.channel))].sort((a,b)=>a-b);
      channels.forEach(ch=>voices.push({name:`${track.name||`Track ${ti+1}`} · CH ${ch+1}`,track:ti,channel:ch,notes:track.notes.filter(n=>n.channel===ch).sort((a,b)=>a.startTick-b.startTick||a.midi-b.midi)}));
    });
    return {format,division,bpm,signature:{num:signature.num,den:signature.den},hasTempoChanges:tempos.length>1,voices,tracks};
  }

  function vlqBytes(n){
    let v=Math.max(0,Math.round(n)),bytes=[v&127];v>>=7;
    while(v){bytes.unshift((v&127)|128);v>>=7;}
    return bytes;
  }
  function chunk(id,payload){
    const size=payload.length;
    return [...id].map(c=>c.charCodeAt(0)).concat([(size>>>24)&255,(size>>>16)&255,(size>>>8)&255,size&255],payload);
  }
  function write(voices,bpm=120,signature={num:4,den:4}){
    const ppq=480,tempo=Math.max(20000,Math.min(3000000,Math.round(60000000/bpm)));
    const header=chunk('MThd',[0,1,0,voices.length+1,(ppq>>8)&255,ppq&255]);
    const denPower=Math.round(Math.log2(signature.den||4));
    const meta=[0,0xff,0x51,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255,0,0xff,0x58,4,signature.num||4,denPower,24,8,0,0xff,0x2f,0];
    const chunks=[header,chunk('MTrk',meta)];
    voices.forEach((voice,i)=>{
      const ch=i%16,events=[];
      (voice.notes||[]).forEach(note=>{
        if(note.midi===null||note.midi<0||note.midi>127)return;
        const start=Math.max(0,Math.round(note.start*ppq)),end=Math.max(start+1,Math.round((note.start+note.duration)*ppq));
        events.push({tick:start,order:1,data:[0x90|ch,note.midi,96]},{tick:end,order:0,data:[0x80|ch,note.midi,0]});
      });
      events.sort((a,b)=>a.tick-b.tick||a.order-b.order);
      const name=new TextEncoder().encode((voice.name||`ESC ${i+1}`).slice(0,60));
      const bytes=[0,0xff,0x03,name.length,...name];let previous=0;
      events.forEach(ev=>{bytes.push(...vlqBytes(ev.tick-previous),...ev.data);previous=ev.tick;});
      bytes.push(0,0xff,0x2f,0);chunks.push(chunk('MTrk',bytes));
    });
    return new Uint8Array(chunks.flat());
  }
  if(typeof window!=='undefined')window.QuadMidi={read,write};
  if(typeof module!=='undefined'&&module.exports)module.exports={read,write};
})();
