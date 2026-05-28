/**
 * Predicate unit tests for project visibility helpers.
 * Run with: node src/lib/collections.test.mjs
 */

import assert from 'node:assert/strict';

// Inline the pure helpers so this file has no build dependency.
function getProjectVisibility(entry) {
  const v = entry.data.visibility;
  if (v === undefined) {
    throw new Error(
      `[portfolio-engine] Project entry "${entry.id}" is missing the required \`visibility\` field.\n` +
        `Add it to your projects collection schema in content.config.ts:\n\n` +
        `  import { ProjectVisibilitySchema } from '@portfolio-engine/schema';\n` +
        `  // inside the projects defineCollection schema object:\n` +
        `  visibility: ProjectVisibilitySchema.optional().default('published'),\n\n` +
        `All existing entries without a frontmatter value will default to 'published'.`,
    );
  }
  return v;
}
function isProjectListed(entry) {
  return getProjectVisibility(entry) === 'published';
}
function isProjectBuildable(entry) {
  return getProjectVisibility(entry) !== 'draft';
}

function makeEntry(visibility) {
  return { id: 'test-entry', data: visibility === undefined ? {} : { visibility } };
}

// undefined — must throw a deprecation error with actionable message
assert.throws(
  () => getProjectVisibility(makeEntry(undefined)),
  (err) => {
    assert.ok(err.message.includes('missing the required `visibility` field'));
    assert.ok(err.message.includes('ProjectVisibilitySchema'));
    assert.ok(err.message.includes('content.config.ts'));
    return true;
  },
  'undefined visibility must throw a descriptive error',
);

// published
assert.equal(isProjectListed(makeEntry('published')), true, 'published => listed');
assert.equal(isProjectBuildable(makeEntry('published')), true, 'published => buildable');

// unlisted
assert.equal(isProjectListed(makeEntry('unlisted')), false, 'unlisted => not listed');
assert.equal(isProjectBuildable(makeEntry('unlisted')), true, 'unlisted => buildable');

// draft
assert.equal(isProjectListed(makeEntry('draft')), false, 'draft => not listed');
assert.equal(isProjectBuildable(makeEntry('draft')), false, 'draft => not buildable');

console.log('collections predicates: all assertions passed');
