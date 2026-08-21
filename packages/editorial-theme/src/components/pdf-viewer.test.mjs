import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const source = await readFile(new URL('./PdfViewer.astro', import.meta.url), 'utf8');

const dynamicSelectors = [
  '.pdf-reader__page',
  '.pdf-reader__page canvas',
  '.pdf-reader__page .textLayer',
  '.textLayer :is(span, br)',
  '.textLayer span.markedContent',
  '.textLayer ::selection',
];

for (const selector of dynamicSelectors) {
  assert.ok(
    source.includes(`:global(${selector})`) || source.includes(`:global(${selector}),`),
    `${selector} must be global because PDF.js creates it after Astro scopes the component CSS`,
  );
}

console.log('PDF viewer dynamic selector scoping: all assertions passed');
