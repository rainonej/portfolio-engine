import assert from 'node:assert/strict';
import { FeaturesConfigSchema, SiteConfigSchema } from '../dist/index.js';

const baseSite = {
  title: 'Test site',
  description: 'Schema fixture.',
  baseUrl: 'https://example.com',
  tagline: 'Test',
  contact: { heading: 'Contact', body: 'Hello.' },
};

assert.equal(
  SiteConfigSchema.safeParse({ ...baseSite, resumePdfUrl: '/documents/resume.pdf' }).success,
  true,
);
assert.equal(
  SiteConfigSchema.safeParse({
    ...baseSite,
    resumePdfUrl: 'https://cdn.example.com/resume.pdf',
  }).success,
  true,
);
assert.equal(
  SiteConfigSchema.safeParse({ ...baseSite, resumePdfUrl: '//cdn.example.com/resume.pdf' }).success,
  false,
);
assert.equal(
  SiteConfigSchema.safeParse({ ...baseSite, resumePdfUrl: 'http://example.com/resume.pdf' })
    .success,
  false,
);

assert.equal(FeaturesConfigSchema.parse({}).resumePage, true);
assert.equal(FeaturesConfigSchema.parse({ resumePage: false }).resumePage, false);

console.log('site config resume controls: all assertions passed');
