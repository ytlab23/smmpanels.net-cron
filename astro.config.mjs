import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://smmpanelsnet.vercel.app/',
  output: "server",
  adapter: vercel({
    maxDuration: 240
  }),
  security: {
    checkOrigin: false
  },
});
