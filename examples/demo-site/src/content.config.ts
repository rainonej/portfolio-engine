import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/profile' }),
  schema: z.union([
    // person entry
    z.object({
      name: z.string(),
      bio: z.string(),
      photo: z.string().optional(),
      email: z.string().optional(),
      linkedin: z.string().url().optional(),
      instagram: z.string().url().optional(),
    }),
    // cv entry
    z.object({
      awards: z
        .array(
          z.object({
            title: z.string(),
            context: z.string().optional(),
            description: z.string().optional(),
            image: z.string().optional(),
          }),
        )
        .optional(),
      education: z
        .array(
          z.object({
            degree: z.string(),
            institution: z.string(),
            location: z.string().optional(),
            year: z.union([z.string(), z.number()]).optional(),
            note: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ]),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    link: z.string().url().optional(),
    date: z.coerce.date(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { profile, projects, writing, testimonials };
