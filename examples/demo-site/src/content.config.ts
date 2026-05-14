import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import {
  MetricSchema,
  PageHeaderSchema,
  RelatedLinkSchema,
  TagListSchema,
  ProfilePersonSchema,
  ProfileCvSchema,
} from '@portfolio-engine/schema';

const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/profile' }),
  schema: z.union([ProfilePersonSchema, ProfileCvSchema]),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    link: z.url().optional(),
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

// Structured YAML records — demonstrates @portfolio-engine/schema primitives.
// Downstream sites use this pattern for page-level data that is too structured
// for prose but too small to warrant a full content collection of its own.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/notes' }),
  schema: z.object({
    header: PageHeaderSchema,
    tags: TagListSchema.optional(),
    metrics: z.array(MetricSchema).optional(),
    links: z.array(RelatedLinkSchema).optional(),
  }),
});

export const collections = { profile, projects, writing, testimonials, notes };
