import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@vainjs/logger',
  description: 'A fully-featured logging solution with local storage and smart upload strategies',
  base: '/logger/',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guides/getting-started' },
      { text: 'Examples', link: '/examples/basic' },
    ],

    sidebar: {
      '/guides/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/guides/installation' },
            { text: 'Quick Start', link: '/guides/getting-started' },
            { text: 'Configuration', link: '/guides/configuration' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [{ text: 'Basic Usage', link: '/examples/basic' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vainjs/logger' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 北冥有鱼',
    },

    search: {
      provider: 'local',
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },
})
