import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' http://localhost:3001; worker-src blob:;",
    },
  },
});
