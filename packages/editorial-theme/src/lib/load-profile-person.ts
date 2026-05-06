import { getEntry } from 'astro:content';

/** Mirrors `profile/person` in the consumer content schema (union collection narrows poorly in types). */
export type ProfilePerson = {
  name: string;
  /** @deprecated Prefer `shortBio` for hero, `longBio` for about/resume. If only `bio` is provided, it is split on blank lines into paragraphs. */
  bio?: string;
  /** Short one-liner shown in the hero and meta descriptions (preferred over `bio`). */
  shortBio?: string;
  /** One or two sentence summary used in cards, meta, and hero fallback. */
  summary?: string;
  /** Full biography rendered as paragraphs on the about/profile page. */
  longBio?: string[];
  /** Structured values shown as cards on the about page. */
  values?: Array<{ title: string; body: string }>;
  /** Working principles / approach items shown on the about page. */
  workingPrinciples?: Array<{ title: string; body: string }>;
  /** Credentials list shown on the resume page. */
  credentials?: string[];
  photo?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
};

/**
 * Split a legacy single `bio` string into paragraphs by blank lines.
 * Returns an empty array when the input is empty/undefined.
 */
export function splitBioParagraphs(bio: string | undefined): string[] {
  if (!bio?.trim()) return [];
  return bio
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Returns the best short description for use in the hero / meta contexts.
 * Prefers `shortBio` > `summary` > first paragraph of `longBio` > first paragraph of `bio`.
 */
export function resolveHeroBio(person: ProfilePerson): string {
  if (person.shortBio) return person.shortBio;
  if (person.summary) return person.summary;
  if (person.longBio && person.longBio.length > 0) return person.longBio[0];
  const paras = splitBioParagraphs(person.bio);
  return paras[0] ?? '';
}

export async function loadProfilePerson(): Promise<ProfilePerson> {
  const personEntry = await getEntry('profile', 'person');
  if (!personEntry) {
    throw new Error('[editorial-theme] Missing content entry profile/person');
  }
  return personEntry.data as ProfilePerson;
}
