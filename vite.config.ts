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

// На file:// браузери блокують <script type="module"> і crossorigin (CORS, origin "null"),
// тому dist/index.html відкривався без стилів і скриптів. Збираємо IIFE та прибираємо ці атрибути.
function fileProtocolSafe(): Plugin {
  return {
    name: 'file-protocol-safe',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) =>
        html
          .replace(/<script type="module" crossorigin /g, '<script defer ')
          .replace(/(<link rel="stylesheet") crossorigin /g, '$1 '),
    },
  };
}

// base './' = працює з кореня, з підпапки на статичному хостингу і через подвійний клік по dist/index.html.
export default defineConfig({
  base: './',
  plugins: [injectContent(), fileProtocolSafe()],
  build: { target: 'es2022', cssCodeSplit: false, rollupOptions: { output: { format: 'iife' } } },
});
