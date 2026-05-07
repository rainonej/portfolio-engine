import { z } from 'zod';

const ValueCardSchema = z.object({
  title: z.string(),
  body: z.string(),
});

const WorkingPrincipleSchema = z.object({
  title: z.string(),
  body: z.string(),
});

/**
 * Canonical `profile/person` shape. Biography copy uses only `shortBio`, `summary`, and `longBio`.
 * The old `bio` string is not accepted here — use `longBio` (paragraph array) instead.
 */
export const ProfilePersonSchema = z
  .object({
    name: z.string(),
    roleLine: z.string().optional(),
    /** Short one-liner for hero and meta. */
    shortBio: z.string().optional(),
    /** One or two sentence summary for cards, meta, and hero fallback. */
    summary: z.string().optional(),
    /** Full biography paragraphs for about and resume pages. */
    longBio: z.array(z.string()).optional(),
    values: z.array(ValueCardSchema).optional(),
    workingPrinciples: z.array(WorkingPrincipleSchema).optional(),
    credentials: z.array(z.string()).optional(),
    email: z.string().optional(),
    linkedin: z.url().optional(),
    github: z.url().optional(),
    instagram: z.url().optional(),
    photo: z.string().optional(),
  })
  .strict();

export const ProfileExperienceSchema = z.object({
  organization: z.string(),
  title: z.string(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  /** Alias for startDate (legacy field used by resume.astro). */
  startYear: z.union([z.string(), z.number()]).optional(),
  /** Alias for endDate (legacy field used by resume.astro). */
  endYear: z.union([z.string(), z.number()]).optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const ProfileEducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  note: z.string().optional(),
});

export const ProfileAwardSchema = z.object({
  title: z.string(),
  context: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const ProfileCvSchema = z.object({
  selectedEvidence: z.array(z.string()).optional(),
  technicalRange: z
    .array(z.object({ heading: z.string(), items: z.array(z.string()) }))
    .optional(),
  experience: z.array(ProfileExperienceSchema).optional(),
  education: z.array(ProfileEducationSchema).optional(),
  awards: z.array(ProfileAwardSchema).optional(),
});

export type ProfilePerson = z.infer<typeof ProfilePersonSchema>;
export type ProfileCv = z.infer<typeof ProfileCvSchema>;
export type ProfileExperience = z.infer<typeof ProfileExperienceSchema>;
export type ProfileEducation = z.infer<typeof ProfileEducationSchema>;
export type ProfileAward = z.infer<typeof ProfileAwardSchema>;
export type ValueCard = z.infer<typeof ValueCardSchema>;
export type WorkingPrinciple = z.infer<typeof WorkingPrincipleSchema>;
