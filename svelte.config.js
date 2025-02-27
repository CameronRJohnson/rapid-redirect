import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */

const dev = process.argv.includes('dev');

const config = {
  preprocess: sveltePreprocess({
    postcss: true
  }),
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),

    paths: {
      base: dev ? 'rapid-redirect' : 'rapid-redirect'
    }
  }
};

export default config;
