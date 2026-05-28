// In examples/demo-site/src/content.config.ts

import {
  MetricSchema,
  PageHeaderSchema,
  RelatedLinkSchema,
  TagListSchema,
  ProfilePersonSchema,
  ProfileCvSchema,
  ProjectVisibilitySchema,
} from '@portfolio-engine/schema';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      featured: z.boolean().optional().default(false),
      visibility: ProjectVisibilitySchema.optional().default('published'),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      link: z.url().optional(),
      date: z.coerce.date(),
    })
    .strict(),
});
