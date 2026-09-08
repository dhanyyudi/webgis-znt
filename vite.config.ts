import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'geojson-loader',
      transform(code, id) {
        if (id.endsWith('.geojson')) {
          return {
            code: 'export default ' + code + ';',
            map: null
          };
        }
      }
    }
  ],
  resolve: {
    alias: {
      '$lib': path.resolve(__dirname, './src/lib'),
      '$data': path.resolve(__dirname, './src/data')
    }
  }
});
