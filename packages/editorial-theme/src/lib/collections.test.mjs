/**
 * Predicate unit tests for project visibility helpers.
 * Run with: node src/lib/collections.test.mjs
 *
 * Verifies upgrade-window compatibility: a ProjectEntry whose data has no
 * visibility field (undefined) must behave identically to published.
 */

import assert from 'node:assert/strict';

// Inline the pure helpers so this file has no build dependency.
function getProjectVisibility(entry) {
  return entry.data.visibility ?? 'published';
}
function isProjectListed(entry) {
  return getProjectVisibility(entry) === 'published';
}
function isProjectBuildable(entry) {
  return getProjectVisibility(entry) !== 'draft';
}

function makeEntry(visibility) {
  return { data: visibility === undefined ? {} : { visibility } };
}

// undefined (legacy entry, no visibility in schema)
assert.equal(isProjectListed(makeEntry(undefined)), true, 'undefined => listed');
assert.equal(isProjectBuildable(makeEntry(undefined)), true, 'undefined => buildable');

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
