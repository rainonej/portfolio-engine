// Add to packages/schema/src/content-primitives.ts

export const ProjectVisibilitySchema = z.enum(['published', 'unlisted', 'draft']);
export type ProjectVisibility = z.infer<typeof ProjectVisibilitySchema>;
