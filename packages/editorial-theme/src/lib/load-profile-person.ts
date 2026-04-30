import { getEntry } from 'astro:content';

/** Mirrors `profile/person` in the consumer content schema (union collection narrows poorly in types). */
export type ProfilePerson = {
  name: string;
  bio: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
};

export async function loadProfilePerson(): Promise<ProfilePerson> {
  const personEntry = await getEntry('profile', 'person');
  if (!personEntry) {
    throw new Error('[editorial-theme] Missing content entry profile/person');
  }
  return personEntry.data as ProfilePerson;
}
