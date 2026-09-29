import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { publicCampaignColumns } from '../lib/campaign.mjs';
let result=null, fails=false, selected='', ttl=0;
const chain={ select(columns){selected=columns;return this;},order(){return this;},limit(){return this;},maybeSingle:async()=>{if(fails)throw Error('offline');return {data:result};}};
const sandbox={process:{env:{DASHBOARD_CAMPAIGNS_ENABLED:'false'}}, publicCampaignColumns,
  NextResponse:{json:(body,options)=>({body,...options})},
  publicDashboardClient:()=>({from:()=>chain,storage:{from:()=>({createSignedUrl:async(path,seconds)=>{ttl=seconds;return {data:{signedUrl:'https://example.invalid/art'}};}})}})};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('app/api/campaigns/active/route.js','utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,'')+'\nglobalThis.get=GET',sandbox);
assert.equal((await sandbox.get()).body.campaign,null);
sandbox.process.env.DASHBOARD_CAMPAIGNS_ENABLED='true';
assert.equal((await sandbox.get()).body.campaign,null);
result={id:'test',popup_title:'Campanha',image_path:'private/path'};
const response=await sandbox.get();
assert.equal(response.body.campaign.popup_title,'Campanha');
assert.equal(response.body.campaign.image_path,undefined);
assert.equal(response.body.campaign.imageUrl,'https://example.invalid/art');
assert.equal(ttl,60); assert.equal(selected.includes('body'),false); assert.equal(selected.includes('created_by'),false);
assert.equal(response.headers['Cache-Control'],'no-store');
fails=true; assert.equal((await sandbox.get()).body.campaign,null);
console.log('PASS public campaign API: feature flag, empty/offline fallback, limited public projection, short-lived artwork URL. Database active-period policies tested separately.');
