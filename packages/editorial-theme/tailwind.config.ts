import { fileURLToPath } from 'node:url';

const themeRoot = fileURLToPath(new URL('.', import.meta.url));

export default {
  content: [
    // Theme's own source files (absolute so this config works from any consumer root)
    `${themeRoot}/src/**/*.{astro,html,js,ts}`,
    // Consumer's source and content files (resolved from the consumer project's build root)
    `${process.cwd()}/src/**/*.{astro,html,js,ts,tsx,jsx}`,
    `${process.cwd()}/content/**/*.{md,mdx}`,
  ],
  theme: { extend: {} },
  plugins: [],
};
