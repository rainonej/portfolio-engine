/**
 * This file lists the default screens and replaceable parts that come with the theme.
 *
 * The first list says which visitor-facing screens the theme provides.
 * The second list says which pieces a site owner is allowed to replace.
 */
import type { OverrideSurfaceEntry, RouteRegistryEntry } from '@portfolio-engine/schema';

export const DEFAULT_ROUTE_REGISTRY: RouteRegistryEntry[] = [
  { pattern: '/', label: 'Home', section: null, visibility: 'public', remappable: true, disableable: false },
  { pattern: '/about', label: 'About', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/work', label: 'Work', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/work/[slug]', label: 'Work detail', section: null, visibility: 'hidden', remappable: true, disableable: true },
  { pattern: '/writing', label: 'Writing', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/writing/[slug]', label: 'Writing detail', section: null, visibility: 'hidden', remappable: true, disableable: true },
  { pattern: '/contact', label: 'Contact', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/resume', label: 'Résumé', section: null, visibility: 'public', remappable: true, disableable: true },
];

export const DEFAULT_OVERRIDE_SURFACES: OverrideSurfaceEntry[] = [
  {
    name: 'Hero',
    props: ['person', 'bookingUrl', 'pillars', 'base', 'tagline', 'ctas'],
    defaultComponentPath: 'src/components/sections/HeroSection.astro',
    hostPage: 'src/pages/index.astro',
  },
  {
    name: 'FeaturedWriting',
    props: ['posts', 'base'],
    defaultComponentPath: 'src/components/sections/FeaturedWritingSection.astro',
    hostPage: 'src/pages/index.astro',
  },
  {
    name: 'TestimonialSection',
    props: ['testimonials'],
    defaultComponentPath: 'src/components/sections/TestimonialSection.astro',
    hostPage: 'src/pages/index.astro',
  },
  {
    name: 'CollaborationSection',
    props: ['base', 'ctaBody'],
    defaultComponentPath: 'src/components/sections/CollaborationSection.astro',
    hostPage: 'src/pages/index.astro',
  },
  {
    name: 'Footer',
    props: ['adminHref', 'siteTitle', 'adminLinkLabel'],
    defaultComponentPath: 'src/components/Footer.astro',
    hostPage: 'src/layouts/Layout.astro',
  },
];
