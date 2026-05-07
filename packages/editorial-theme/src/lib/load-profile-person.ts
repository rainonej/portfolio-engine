import { getEntry } from 'astro:content';
import type { ProfilePerson } from './profile-person.js';

export type { ProfilePerson } from './profile-person.js';
export { resolveHeroBio, resolveLongBioParagraphs } from './profile-person.js';

export async function loadProfilePerson(): Promise<ProfilePerson> {
  const personEntry = await getEntry('profile', 'person');
  if (!personEntry) {
    throw new Error('[editorial-theme] Missing content entry profile/person');
  }
  return personEntry.data as ProfilePerson;
}
