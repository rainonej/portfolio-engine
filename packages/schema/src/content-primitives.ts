import { z } from 'zod';

export const ImageAssetSchema = z
  .object({
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  })
  .strict();

export const MetricSchema = z
  .object({
    value: z.string(),
    label: z.string(),
    note: z.string().optional(),
  })
  .strict();

export const EvidenceItemSchema = z
  .object({
    label: z.string(),
    body: z.string(),
    caveat: z.string().optional(),
  })
  .strict();

export const RelatedLinkSchema = z
  .object({
    label: z.string().optional(),
    title: z.string(),
    href: z.string(),
  })
  .strict();

export const TagListSchema = z.array(z.string());

export const PageHeaderSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string(),
    dek: z.string().optional(),
  })
  .strict();

export const CalloutSchema = z
  .object({
    heading: z.string().optional(),
    body: z.string(),
    variant: z.enum(['info', 'warning', 'tip', 'note']).optional(),
  })
  .strict();

export const ContentBlockSchema = z
  .object({
    heading: z.string().optional(),
    body: z.string(),
    image: ImageAssetSchema.optional(),
  })
  .strict();

export const CardSummarySchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    href: z.string().optional(),
    image: ImageAssetSchema.optional(),
    tags: TagListSchema.optional(),
  })
  .strict();

export const TemplateContractSchema = z
  .object({
    id: z.string(),
    routePattern: z.string(),
    contentCollections: z.array(z.string()).optional(),
    pageContentId: z.string().optional(),
    requiredFields: z.array(z.string()).default([]),
    optionalFields: z.array(z.string()).default([]),
    allowedComponents: z.array(z.string()).default([]),
  })
  .strict();

export type ImageAsset = z.infer<typeof ImageAssetSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type RelatedLink = z.infer<typeof RelatedLinkSchema>;
export type TagList = z.infer<typeof TagListSchema>;
export type PageHeader = z.infer<typeof PageHeaderSchema>;
export type Callout = z.infer<typeof CalloutSchema>;
export type ContentBlock = z.infer<typeof ContentBlockSchema>;
export type CardSummary = z.infer<typeof CardSummarySchema>;
export type TemplateContract = z.infer<typeof TemplateContractSchema>;

export const ProjectVisibilitySchema = z.enum(['published', 'unlisted', 'draft']);
export type ProjectVisibility = z.infer<typeof ProjectVisibilitySchema>;
