import { defineConfig, type Plugin } from 'vite';
import { renderBody, headExtra, meta } from './src/render.ts';

// Підставляє контент із src/config/site.ts в index.html під час dev і build.
function injectContent(): Plugin {
  const tokens: Record<string, string> = {
    '%TITLE%': meta.title,
    '%DESCRIPTION%': meta.description,
    '%HEAD_EXTRA%': headExtra(),
    '%BODY%': renderBody(),
  };
  return {
    name: 'inject-content',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => Object.entries(tokens).reduce((out, [k, v]) => out.split(k).join(v), html),
    },
  };
}

// base './' = працює з кореня і з підпапки на будь-якому статичному хостингу.
export default defineConfig({
  base: './',
  plugins: [injectContent()],
  build: { target: 'es2022' },
});
