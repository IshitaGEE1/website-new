import SiteMapGenerator from './assets/js/SiteMapGenerator';
import PathsGenerator from './assets/js/PathsGenerator';
import HubspotConfig from './plugins/hubspot';
import GreenhouseConfig from './plugins/greenhouse';
import translationsDe from './i18n/de';
import translationsEn from './i18n/en';
import translationsFr from './i18n/fr';
import translationsIt from './i18n/it';
import translationsEs from './i18n/es';

const DEFAULT_HOSTNAME = 'https://www.productsup.com';

export default {
  env: {
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    CTF_PREVIEW: process.env.PREVIEW === 'true',
    HOSTNAME: process.env.HOSTNAME || DEFAULT_HOSTNAME
  },

  target: process.env.NUXT_TARGET || 'static',

  basic: {
    name: 'productsup',
    pass: process.env.BASIC_AUTH_PASSWORD || 'productsup',
    enabled: process.env.BASIC_AUTH_ENABLED === 'true'
  },

  i18n: {
    detectBrowserLanguage: false,
    strategy: 'prefix_and_default',
    locales: [
      { code: 'de', name: 'Deutsch' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'it', name: 'Italiano' },
      { code: 'es', name: 'Español' }
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        de: translationsDe,
        en: translationsEn,
        fr: translationsFr,
        it: translationsIt,
        es: translationsEs
      }
    }
  },

  sitemap: {
    hostname: DEFAULT_HOSTNAME,
    gzip: true,
    exclude: SiteMapGenerator.STATIC_BLACKLIST,
    routes: SiteMapGenerator.generateSiteMapRoutes,
    cacheTime: -1
  },

  generate: {
    routes: process.env.GENERATE_PATH ? [process.env.GENERATE_PATH] : PathsGenerator.generatePaths,
    exclude: [/.*/],
    concurrency: 8,
    crawler: false
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Productsup',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon/pup-fav-icon-32.ico', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/icons/favicon/favicon-96x96.png' },
      { rel: 'icon', type: 'image/svg+xml', href: '/icons/favicon/pup-fav-icon.svg', sizes: 'any' },
      { rel: 'apple-touch-icon', href: '/icons/favicon/apple-icon-180x180.png' },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: '/fonts/nunito-v16-latin-regular.woff2',
        as: 'font',
        crossorigin: true
      },
      { rel: 'preload', type: 'font/woff2', href: '/fonts/nunito-v16-latin-600.woff2', as: 'font', crossorigin: true },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/a3e771/00000000000000007735ab83/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/ad26fa/00000000000000007735ab68/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/0075ed/00000000000000007735ab5e/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/deabda/00000000000000007735ab76/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/3d6d2c/00000000000000007735ab67/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/07be96/00000000000000007735ab50/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/3e92be/00000000000000007735ab48/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i8&v=3',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        type: 'font/woff2',
        href: 'https://use.typekit.net/af/189a26/00000000000000007735ab3e/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3',
        as: 'font',
        crossorigin: true
      }
    ],
    script: [
      HubspotConfig.formScript,
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'normalize.css/normalize.css',
    '~/assets/css/_fonts.css',
    '~/assets/css/_animations.css',
    '~/assets/css/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/portal.js',
    '~/plugins/clickOutside.directive.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [{
    path: '~/components/_base/',
    prefix: ''
  }, {
    path: '~/components/_contentful/',
    prefix: ''
  }, {
    path: '~/components/atom/',
    prefix: 'element'
  }, {
    path: '~/components/molecule/',
    prefix: 'element'
  }, {
    path: '~/components/organism/',
    prefix: 'module'
  }],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-basic-auth-module',
    'nuxt-i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/style-resources'
  ],

  styleResources: {
    // your settings here
    scss: [
      '~/assets/css/_variables.scss',
      '~/assets/css/_mixins.scss',
      '~/assets/css/_placeholders.scss'
    ],
    hoistUseStatements: true  // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // postcss: false,
    cache: true,
    parallel: true,
    hardSource: true
    // KEEP IN MIND FOR LATER IMPROVEMENT
    // extractCSS: {
    //   ignoreOrder: false
    // }
  },

  router: {
    prefetchPayloads: false,
    trailingSlash: true,
    middleware: 'ContenfulPreviewUrl'
  }
}
