import { mapState } from 'vuex';
import ContentfulResponseHelper from '../services/ContentfulResponseHelper';
import ContentTypes from '../enums/ContentTypes';
import InternalLinkService from '../services/internalLink.service';
import { createClient } from '../../../plugins/contentful';

const client = createClient();

export default {
  head() {
    return {
      title: `${this.title} | Productsup`,
      meta: [
        ...this.seoHeaders,
        ...this.openGraphTags
      ],
      link: [
        this.canonicalLink,
        ...this.hreflangs
      ],
      htmlAttrs: {
        lang: this.lang
      }
    }
  },
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale);
  },
  computed: {
    ...mapState({
      urlByLocales: 'urlByLocales'
    }),
    lang() {
      return this.$i18n.locale;
    },
    pageId() {
      return this.sys.id;
    },
    pageType() {
      return this.fields?.sys?.contentType?.sys?.id;
    },
    title() {
      return this.fields?.title || '';
    },
    urlSubfolder() {
      return this.fields?.urlSubfolder || '';
    },
    slug() {
      return this.fields.slug || '';
    },
    openGraphTags() {
      const og = this.fields?.openGraphMetaData;
      const ogTitle = og?.fields?.openGraphTitle;
      const ogDescription = og?.fields?.openGraphDescription;
      const ogImage = og?.fields?.openGraphImage;
      const ogAdditionals = og?.fields?.additionalOpenGraphTags;

      //disable if no option is set
      if (!ogTitle && !ogDescription && !ogImage && (!ogAdditionals || !ogAdditionals.length > 0))
        return [];

      let prefix = this.sys.locale === 'en' ? '' : `/${this.sys.locale}`;

      let queries = '';
      if (this.$route && this.$route.query) {
        queries = Object.keys(this.$route.query).map(key => `${key}=${this.$route.query[key]}`).join('&');
      }
      const queryPart = queries !== '' ? `?${queries}` : '';

      let ogTags = [
        //these tags are always available
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:site_name',
          content: 'productsup.com'
        },
        {
          property: 'og:url',
          content: `https://www.productsup.com${prefix}${this.urlSubfolder}${this.slug}/${queryPart}`
        }
      ];

      //these tags may or may not be added, even though that might cause og tags not to be complete
      if (ogTitle) ogTags.push({ property: 'og:title', content: ogTitle });
      if (ogDescription) ogTags.push({ property: 'og:description', content: ogDescription });
      if (ogImage?.fields?.file?.url) ogTags.push({
        property: 'og:image',
        content: 'https:' + ogImage.fields.file.url
      });

      //tags added by editors
      if (ogAdditionals) {
        ogTags = [
          ...ogTags,
          ...(ogAdditionals.map(e => ({
            hid: e.key,
            property: e.key,
            content: e.value
          })))
        ]
      }

      return ogTags;
    },
    seoHeaders() {
      const seo = this.fields?.seo;
      const seoHeader = [];
      const robotsValues = [];
      if (!!seo?.fields?.no_index) {
        robotsValues.push(['noindex']);
      } else {
        robotsValues.push(['index']);
      }

      if (!!seo?.fields?.no_follow) {
        robotsValues.push(['nofollow']);
      } else {
        robotsValues.push(['follow']);
      }
      seoHeader.push({ name: 'robots', content: robotsValues.join(',') });

      if (seo?.fields?.description) {
        seoHeader.push({ name: 'description', content: seo.fields.description });
      }
      if (seo?.fields?.title) {
        seoHeader.push({ name: 'title', content: seo.fields.title });
      }
      if (seo?.fields?.keywords) {
        seoHeader.push({ name: 'keywords', content: seo.fields.keywords });
      }
      return seoHeader;
    },
    canonicalLink() {
      return {
        rel: 'canonical',
        href: process.env.HOSTNAME + this.$route.path
      };
    },
    hreflangs() {
      return this.urlByLocales?.map(i => {
        return {
          rel: 'alternate',
          hreflang: i.locale.code === 'en' ? 'x-default' : i.locale.code,
          href: InternalLinkService.processLink(process.env.HOSTNAME + this.localePath({ path: i.url }, i.locale.code))
        }
      });
    },
    content() {
      if (!this.fields) {
        return [];
      }
      return Object.values(this.fields)
        .filter(i => i instanceof Object)
        .flat()
        .map(i => ({
          ...i,
          contentType: i?.sys?.contentType?.sys?.id
        }))
        .filter(i => Object.values(ContentTypes.modules).includes(i.contentType))
        .filter(i => ![ContentTypes.modules.pageHeader, ContentTypes.modules.pageFooter, ContentTypes.modules.landingPageFooter].includes(i.contentType))
        .filter(i => i.contentType);
    },
    header() {
      const header = this.fields?.header;
      if (!header) {
        return undefined;
      }
      return {
        ...header,
        contentType: header.sys?.contentType?.sys?.id
      };
    },
    footer() {
      const footer = this.fields?.footer;
      if (!footer) {
        return undefined;
      }
      return {
        ...footer,
        contentType: footer.sys?.contentType?.sys?.id
      };
    }
  },
  mounted() {
    this.$store.commit('setQueryParameter', this.$route.query);
  }
}

export async function fetchPageData(ctx, locale = ctx.i18n.defaultLocale, pageType = ContentTypes.pages.core) {
  let route = ctx.localePath({ params: ctx.route.params }).substr(1);
  if (locale !== ctx.i18n.defaultLocale) {
    route = route.substr(3);
  }
  let pathParts = route.split('/').filter(e => e !== '');
  let slug = pathParts.reverse()[0];
  let subfolder = '/' + route.substr(0, route.lastIndexOf(slug));
  slug = slug || 'index';

  if (ctx.isDev) {
    console.info('ROUTE', ctx.route.path);
    console.info('NAME', ctx.route.name);
    console.info('LOCALE', locale);
    console.info('URL-SUBFOLDER', subfolder);
    console.info('SLUG', slug);
    console.info('PAGE_TYPE', pageType);
  }

  let pageEntry;

  try {
    pageEntry = await client.getEntries({
      locale,
      include: 10,
      limit: 1,
      content_type: pageType,
      'fields.urlSubfolder': subfolder,
      'fields.slug': slug,
    }).then((response) => response.items[0]);
  } catch (ex) {
    console.log(ex)
  }

  // if page not able to be fetched -> probably 404 error
  if (!pageEntry) {
    console.error('Error 404: Page could not be found.')
    ctx.error({ message: 'Error 404', statusCode: 404 });
    return;
  }

  let localizedEntries = await client.getEntries({
    content_type: pageType,
    'sys.id': pageEntry.sys.id,
    locale: '*'
  }).then((response) => response.items[0]);

  // if page not able to be fetched -> probably 404 error
  if (!localizedEntries) {
    console.error('Error 404: Page could not be found in the selected language.')
    ctx.error({ message: 'Error 404', statusCode: 404 });
    return;
  }

  // parsing routes from different language version
  const urlByLocales = Array.from(ctx.i18n.locales).map(locale => {
    const subfolder = localizedEntries.fields.urlSubfolder[locale.code];
    let slug = localizedEntries.fields.slug[locale.code];

    // remove index from url path
    if (slug && slug.includes('index')) {
      slug = slug.replace('index', '')
    }

    return {
      locale,
      slug,
      url: subfolder && slug !== undefined ? `${subfolder}${slug}` : undefined
    };
  }).filter(i => i.url !== undefined);

  // configuring routes for language switch
  let payload = {};
  urlByLocales.forEach(i => payload[i.locale.code] = {
    pathMatch: slug.includes('index') ? i.url.substr(1) : i.url.substr(1) + '/',
    slug: i.slug
  });

  await ctx.store.commit('setUrlByLocales', urlByLocales);
  await ctx.store.dispatch('i18n/setRouteParams', payload);

  ContentfulResponseHelper.cleanupFields(pageEntry.fields, pageEntry.sys.id);

  return pageEntry;
}

export function fetchPageHeader(id, locale) {
  return client.getEntries({
    content_type: ContentTypes.modules.pageHeader,
    'sys.id': id,
    locale,
    include: 5
  }).then((response) => response.items[0])
}

export function fetchPageFooter(id, locale) {
  return client.getEntries({
    content_type: ContentTypes.modules.pageFooter,
    'sys.id': id,
    locale,
    include: 5
  }).then((response) => {
    const footer = response.items[0];
    if (!footer) {
      return undefined;
    }
    return {
      ...footer,
      contentType: footer.sys?.contentType?.sys?.id
    };
  })
}
