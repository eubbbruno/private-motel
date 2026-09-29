import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { readLimitedBody } from '../lib/read-body.mjs';
import { mediaPathPattern } from '../lib/campaign.mjs';
let authorized = true, uploads = 0, uploaded;
const storage = { upload: async(path,buffer)=>{ uploads++; uploaded={path,buffer}; return {}; }, createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/art'}}) };
const sandbox = { sharp, randomUUID, readLimitedBody, mediaPathPattern, Buffer, URL,
  dashboardAccess:async()=>({user:{status:authorized?200:401,userId:'00000000-0000-4000-8000-000000000001'},client:{storage:{from:()=>storage}}}),
  NextResponse:{json:(body,options)=>({body,...options})} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('app/api/dashboard/media/route.js','utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,'')+'\nglobalThis.handlers={POST,GET}',sandbox);
const post=body=>sandbox.handlers.POST(new Request('https://example.invalid',{method:'POST',body}));
authorized=false; assert.equal((await post('invalid')).status,401); assert.equal(uploads,0);
authorized=true; assert.equal((await post('not an image')).status,400);
assert.equal((await post(await sharp({create:{width:100,height:100,channels:3,background:'#111111'}}).png().toBuffer())).status,400);
const source=await sharp({create:{width:2400,height:1600,channels:3,background:'#111111'}}).jpeg().toBuffer();
assert.equal((await post(source)).status,201);
const metadata=await sharp(uploaded.buffer).metadata();
assert.equal(metadata.format,'webp'); assert.equal(metadata.width,1800); assert.equal(metadata.height,1200); assert.equal(metadata.exif,undefined); assert.equal(mediaPathPattern.test(uploaded.path),true);
assert.equal((await sandbox.handlers.GET(new Request('https://example.invalid?path=../../x'))).status,400);
console.log('PASS media: unauthenticated/invalid/small uploads rejected, real Sharp conversion/resizing and metadata stripping; storage mocked, no real uploads.');
