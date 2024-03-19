import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import hrmlParser from './hrml/parser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'hrml-parser',
      transform(code, id) {
        if (!id.endsWith('.hrml')) {
          return;
        }
        const result = hrmlParser(code);
        return {
          code: `export default ${JSON.stringify(result)}`,
          map: null
        };
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
