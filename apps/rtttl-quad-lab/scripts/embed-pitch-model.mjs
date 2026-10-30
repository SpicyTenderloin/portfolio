// Build-time only: embed both GraphModel artifacts into a single browser script.
// Avoids fetch() of adjacent model files, so file:// usage works offline.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const modelDir=resolve('node_modules/@spotify/basic-pitch/model');
const manifest=JSON.parse(await readFile(resolve(modelDir,'model.json'),'utf8'));
const groups=manifest.weightsManifest;
if(groups.length!==1||groups[0].paths.length!==1)throw Error('Basic Pitch model layout changed; update embedding script.');
const weights=await readFile(resolve(modelDir,groups[0].paths[0]));
const content=`// Generated from @spotify/basic-pitch model (Apache-2.0). Do not edit.\n`+
  `export const topology=${JSON.stringify(manifest.modelTopology)};\n`+
  `export const weightSpecs=${JSON.stringify(groups[0].weights)};\n`+
  `export const weightBase64=${JSON.stringify(weights.toString('base64'))};\n`;
await mkdir(resolve('src'),{recursive:true});
await writeFile(resolve('src/pitch-embedded.js'),content);
