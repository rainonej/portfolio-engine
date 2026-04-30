import fs from 'node:fs';
import path from 'node:path';
const ROOT=path.resolve('/mnt/data/portfolio_engine_v4_report_pack');
let ok=true; const msgs=[];
try{ JSON.parse(fs.readFileSync(path.join(ROOT,'source/project_model.json'),'utf8')); msgs.push('OK: source/project_model.json parses.'); }catch(e){ ok=false; msgs.push('ERROR: JSON parse failed: '+e.message); }
const html=fs.readFileSync(path.join(ROOT,'report/index.html'),'utf8');
if(!html.includes('<!doctype html>')){ ok=false; msgs.push('ERROR: missing doctype.'); } else msgs.push('OK: doctype present.');
for(const id of ['goals','packages','graph','upstream','consumer','audit','roadmap','epics','sources']){ if(!html.includes(`id="${id}"`)){ ok=false; msgs.push('ERROR: missing section '+id); } }
if(!fs.existsSync(path.join(ROOT,'report/assets/styles.css'))){ ok=false; msgs.push('ERROR: missing stylesheet.'); } else msgs.push('OK: stylesheet exists.');
const epics=fs.readdirSync(path.join(ROOT,'source/epics')).filter(f=>f.endsWith('.md'));
const sections=fs.readdirSync(path.join(ROOT,'source/sections')).filter(f=>f.endsWith('.md'));
if(epics.length<8){ ok=false; msgs.push('ERROR: expected >=8 epic files, found '+epics.length); } else msgs.push('OK: found '+epics.length+' epic source files.');
if(sections.length<6){ ok=false; msgs.push('ERROR: expected >=6 section files, found '+sections.length); } else msgs.push('OK: found '+sections.length+' section source files.');
msgs.push('NOTE: This is a structural/link check. It is not a full W3C validator.');
fs.writeFileSync(path.join(ROOT,'validation/validation_log.txt'), msgs.join('\n')+'\n');
console.log(msgs.join('\n'));
process.exit(ok?0:1);
