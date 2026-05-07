/** Mirrors `profile/person` in the consumer content schema (union collection narrows poorly in types). */
export type ProfilePerson = {
  name: string;
  /**
   * @deprecated Not read by the theme. Content must use `shortBio`, `summary`, and `longBio`
   * (`ProfilePersonSchema` rejects this key). Remove `bio` from JSON and migrate copy into those fields.
   */
  bio?: string;
  /** Short one-liner shown in the hero and meta descriptions. */
  shortBio?: string;
  /** One or two sentence summary used in cards, meta, and hero fallback. */
  summary?: string;
  /** Full biography rendered as paragraphs on the about/profile and resume pages. */
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

/** Normalized paragraphs from `longBio` only (blank entries dropped). */
export function resolveLongBioParagraphs(person: ProfilePerson): string[] {
  return person.longBio?.filter((p) => Boolean(p?.trim())).map((p) => p.trim()) ?? [];
}

/**
 * Short line for hero/meta: `shortBio`, then `summary`, then first `longBio` paragraph.
 */
export function resolveHeroBio(person: ProfilePerson): string {
  if (person.shortBio) return person.shortBio;
  if (person.summary) return person.summary;
  const paragraphs = resolveLongBioParagraphs(person);
  return paragraphs[0] ?? '';
}
