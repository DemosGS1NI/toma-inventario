import vercel from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: vercel({
      runtime: 'nodejs18.x' // Specify Node.js 20 runtime
    })
  }
};
