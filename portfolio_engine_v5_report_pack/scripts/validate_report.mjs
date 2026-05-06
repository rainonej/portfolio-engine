import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
let ok = true;
const msgs = [];

try {
  JSON.parse(fs.readFileSync(path.join(ROOT, 'source/project_model.json'), 'utf8'));
  msgs.push('OK: source/project_model.json parses.');
} catch (e) {
  ok = false;
  msgs.push('ERROR: JSON parse failed: ' + e.message);
}

const html = fs.readFileSync(path.join(ROOT, 'report/index.html'), 'utf8');

if (!html.includes('<!doctype html>')) {
  ok = false;
  msgs.push('ERROR: missing doctype.');
} else {
  msgs.push('OK: doctype present.');
}

for (const id of [
  'status',
  'goals',
  'packages',
  'graph',
  'upstream',
  'consumer',
  'audit',
  'roadmap',
  'board',
  'products',
  'gap',
  'epics',
  'sources',
]) {
  if (!html.includes(`id="${id}"`)) {
    ok = false;
    msgs.push('ERROR: missing section ' + id);
  }
}

if (!fs.existsSync(path.join(ROOT, 'report/assets/styles.css'))) {
  ok = false;
  msgs.push('ERROR: missing stylesheet.');
} else {
  msgs.push('OK: stylesheet exists.');
}

const epics = fs.readdirSync(path.join(ROOT, 'source/epics')).filter((f) => f.endsWith('.md'));
const sections = fs
  .readdirSync(path.join(ROOT, 'source/sections'))
  .filter((f) => f.endsWith('.md'));

if (epics.length < 18) {
  ok = false;
  msgs.push('ERROR: expected >=18 epic files, found ' + epics.length);
} else {
  msgs.push('OK: found ' + epics.length + ' epic source files.');
}

if (sections.length < 8) {
  ok = false;
  msgs.push('ERROR: expected >=8 section files, found ' + sections.length);
} else {
  msgs.push('OK: found ' + sections.length + ' section source files.');
}

if (!html.includes('class="phase-timeline"')) {
  ok = false;
  msgs.push('ERROR: phase timeline not rendered (missing .phase-timeline div).');
} else {
  msgs.push('OK: phase timeline rendered.');
}

const milestoneCount = (html.match(/class="milestone-banner"/g) || []).length;
if (milestoneCount < 2) {
  ok = false;
  msgs.push('ERROR: expected 2 milestone banners, found ' + milestoneCount);
} else {
  msgs.push('OK: ' + milestoneCount + ' milestone banners present.');
}

const epicAnchorCount = (html.match(/id="epic-[a-z-]+"/g) || []).length;
if (epicAnchorCount < 18) {
  ok = false;
  msgs.push('ERROR: expected >=18 epic-* anchor IDs, found ' + epicAnchorCount);
} else {
  msgs.push('OK: ' + epicAnchorCount + ' epic anchor IDs present.');
}

const ticketAnchorCount = (html.match(/id="epic-[a-z-]+__[a-z0-9-]+"/g) || []).length;
if (ticketAnchorCount < 30) {
  ok = false;
  msgs.push('ERROR: expected >=30 ticket anchor IDs, found ' + ticketAnchorCount);
} else {
  msgs.push('OK: ' + ticketAnchorCount + ' ticket anchor IDs present.');
}

const v4Count = (html.match(/\bv4\b/gi) || []).length;
if (v4Count > 0) {
  ok = false;
  msgs.push('ERROR: found ' + v4Count + ' "v4" literal(s) in rendered HTML.');
} else {
  msgs.push('OK: no "v4" literals in rendered HTML.');
}

msgs.push('NOTE: This is a structural/link check. It is not a full W3C validator.');

fs.writeFileSync(path.join(ROOT, 'validation/validation_log.txt'), msgs.join('\n') + '\n');
console.log(msgs.join('\n'));
process.exit(ok ? 0 : 1);
