import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://tegridy.agency',
  base: '/base',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Tegridy Docs',
      description: 'Documentation for Tegridy Agency.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/NidWare/tegridy.agency' },
      ],
      sidebar: [
        { label: 'Welcome', slug: 'index' },
        {
          label: 'Guides',
          items: [{ autogenerate: { directory: 'guides' } }],
        },
      ],
    }),
  ],
});
