import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // site: 'http://localhost:4321',
  // site: 'https://smm-admin.vercel.app/',
  // site: 'https://smm-reviews-panel-v2.vercel.app/',
  // site: 'https://smm-admin2.vercel.app/',
  // site: 'https://smm-admin-smmpanels.vercel.app/',
  site: 'https://smmpanels-admin.vercel.app/',
  output: "server",
  adapter: vercel(),
  security: {
    checkOrigin: false
  },
});