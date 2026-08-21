import assert from 'node:assert/strict';
import { resolveProfileEmails } from './profile-person.ts';

assert.deepEqual(
  resolveProfileEmails({
    name: 'Test Person',
    email: ' primary@example.edu ',
    emails: [
      { label: 'Personal', address: 'personal@example.com' },
      { label: 'Duplicate', address: 'PRIMARY@example.edu' },
      { label: 'Trimmed', address: ' another@example.org ' },
    ],
  }),
  [
    { address: 'primary@example.edu' },
    { label: 'Personal', address: 'personal@example.com' },
    { label: 'Trimmed', address: 'another@example.org' },
  ],
);

assert.deepEqual(resolveProfileEmails({ name: 'Test Person', email: '   ', emails: [] }), []);

console.log('profile email resolver: all assertions passed');
