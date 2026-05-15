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
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      featured: z.boolean().optional().default(false),
      image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      link: z.url().optional(),
      date: z.coerce.date(),
    })
    .strict(),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      image: z.string().optional(),
      draft: z.boolean().optional().default(false),
      tags: z.array(z.string()).optional(),
    })
    .strict(),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z
    .object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
      featured: z.boolean().optional().default(false),
    })
    .strict(),
});

// Structured YAML records — demonstrates @portfolio-engine/schema primitives.
// Downstream sites use this pattern for page-level data that is too structured
// for prose but too small to warrant a full content collection of its own.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/notes' }),
  schema: z
    .object({
      header: PageHeaderSchema,
      tags: TagListSchema.optional(),
      metrics: z.array(MetricSchema).optional(),
      links: z.array(RelatedLinkSchema).optional(),
    })
    .strict(),
});

// Structured page-copy for consumer-local routes in src/pages-local/.
// Route files load a page entry by ID and pass its data to a template component.
// This enforces the content → schema → model → template → component boundary.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z
    .object({
      meta: z
        .object({
          title: z.string(),
          description: z.string(),
        })
        .strict(),
      intro: z
        .object({
          dek: z.string().optional(),
          paragraphs: z.array(z.string()).optional(),
        })
        .strict()
        .optional(),
      sections: z
        .array(
          z
            .object({
              eyebrow: z.string().optional(),
              heading: z.string(),
              subheading: z.string().optional(),
              body: z.string().optional(),
            })
            .strict(),
        )
        .optional(),
      features: z
        .array(
          z
            .object({
              name: z.string(),
              status: z.enum(['shipped', 'optional', 'experimental']),
              description: z.string(),
              docUrl: z.url(),
            })
            .strict(),
        )
        .optional(),
      lanes: z
        .array(
          z
            .object({
              eyebrow: z.string().optional(),
              heading: z.string(),
              body: z.string(),
              examples: z.array(z.string()).optional(),
              links: z.array(z.object({ label: z.string(), href: z.string() }).strict()).optional(),
            })
            .strict(),
        )
        .optional(),
      layers: z
        .array(
          z
            .object({
              label: z.string(),
              title: z.string(),
              description: z.string(),
            })
            .strict(),
        )
        .optional(),
      guardrails: z
        .array(
          z
            .object({
              title: z.string(),
              body: z.string(),
            })
            .strict(),
        )
        .optional(),
      diagram: z
        .object({
          title: z.string(),
          caption: z.string().optional(),
        })
        .strict()
        .optional(),
      demoNote: z.string().optional(),
    })
    .strict(),
});

export const collections = { profile, projects, writing, testimonials, notes, pages };
