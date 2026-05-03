export interface RouteRegistryEntry {
  pattern: string;
  label: string;
  section: string | null;
  visibility: 'public' | 'admin-only' | 'hidden';
  remappable: boolean;
  disableable: boolean;
}

export interface OverrideSurfaceEntry {
  name: string;
  props: string[];
  defaultComponentPath: string;
  hostPage: string;
  docsUrl?: string;
  guidance?: string;
}

export const DEFAULT_ROUTE_REGISTRY: RouteRegistryEntry[] = [
  { pattern: '/', label: 'Home', section: null, visibility: 'public', remappable: true, disableable: false },
  { pattern: '/about', label: 'About', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/work', label: 'Work', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/work/[slug]', label: 'Work detail', section: null, visibility: 'hidden', remappable: false, disableable: false },
  { pattern: '/writing', label: 'Writing', section: null, visibility: 'public', remappable: true, disableable: true },
  { pattern: '/writing/[slug]', label: 'Writing detail', section: null, visibility: 'hidden', remappable: false, disableable: false },
  { pattern: '/contact', label: 'Contact', section: null, visibility: 'public', remappable: true, disableable: true },
];

export const DEFAULT_OVERRIDE_SURFACES: OverrideSurfaceEntry[] = [
  { name: 'Hero', props: ['site', 'person'], defaultComponentPath: 'src/components/sections/HeroSection.astro', hostPage: 'src/pages/index.astro' },
  { name: 'FeaturedWriting', props: ['posts'], defaultComponentPath: 'src/components/sections/FeaturedWritingSection.astro', hostPage: 'src/pages/index.astro' },
  { name: 'TestimonialSection', props: ['items'], defaultComponentPath: 'src/components/sections/TestimonialSection.astro', hostPage: 'src/pages/index.astro' },
  { name: 'CollaborationSection', props: ['features'], defaultComponentPath: 'src/components/sections/CollaborationSection.astro', hostPage: 'src/pages/index.astro' },
  { name: 'Footer', props: ['site'], defaultComponentPath: 'src/components/Footer.astro', hostPage: 'src/layouts/Layout.astro' },
];
