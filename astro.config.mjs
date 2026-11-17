// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The live address. It drives canonical URLs, Open Graph tags and the sitemap.
// Keep public/robots.txt in step with it.
const SITE_URL = 'https://mert.lydionenergy.nl';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
});
