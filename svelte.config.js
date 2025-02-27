import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html' // Enables client-side routing for dynamic pages
    }),
    paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
    },
    prerender: {
      entries: ['*'],
    },
  }
};
