// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO(Mert): set the final domain. It drives canonical URLs, Open Graph tags and the sitemap.
const SITE_URL = 'https://lydion.energy';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
});
