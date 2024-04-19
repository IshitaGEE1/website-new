import ElementSources from '../enums/ElementSources';
import { createGraphQlClient } from '../../../plugins/graphql';
import ContentTypes from '../enums/ContentTypes';

const gqlClient = createGraphQlClient();

export default {
  data() {
    return {
      elementSource: ElementSources.MANUALLY,
      elements: []
    }
  },
  async fetch() {
    this.elementSource = this.fields?.elementSource || ElementSources.MANUALLY;

    await this.fillItems(this.elementSource)
      .then((response) => this.elements = response)
      .catch(console.error)
  },
  methods: {
    async fillItems(source) {
      const locale = this.$i18n.locale;

      switch (source) {
        case ElementSources.ARTICLES:
          return await gqlClient.getBlogPostTeasers(locale);
        case ElementSources.CUSTOMERS:
          return await gqlClient.getCustomerTeasers(locale);
        case ElementSources.EVENTS:
          return await gqlClient.getEventTeasers(locale);
        case ElementSources.PARTNERS:
          return await gqlClient.getPartnerTeasers(locale);
        case ElementSources.MANUALLY:
        default:
          return this.fields.elements.map(e => {
            const contentType = e.sys.contentType.sys.id;

            if (contentType === ContentTypes.pages.article) {
              return {
                ...parseBasisFields(e),
                ...parseBlogPostTeaserFields(e)
              }
            } else if (contentType === ContentTypes.pages.customer) {
              return {
                ...parseBasisFields(e),
                ...parseCustomerTeaserFields(e)
              }
            } else if (contentType === ContentTypes.pages.event) {
              return {
                ...parseBasisFields(e),
                ...parseEventTeaserFields(e)
              }
            } else if (contentType === ContentTypes.pages.partner) {
              return {
                ...parseBasisFields(e),
                ...parsePartnerTeaserFields(e)
              }
            } else if (contentType === ContentTypes.pages.companyNews) {
              return {
                ...parseBasisFields(e),
                ...parseCompanyNewsTeaserFields(e)
              }
            }

            return {
              typeName: e.sys.contentType.sys.id,
              id: e.sys.id,
              ...e
            }
          });
      }
    }
  }
}

function parseBasisFields(node) {
  return {
    typeName: node.sys.contentType.sys.id,
    id: node.sys.id
  }
}

function parseBlogPostTeaserFields(node) {
  return {
    ...node.fields,
    url: `${node.fields.urlSubfolder}${node.fields.slug}`,
    category: node.fields.category.fields,
    image: node.fields.image.fields.file,
  }
}

function parseCustomerTeaserFields(node) {
  return {
    ...node.fields,
    url: `${node.fields.urlSubfolder}${node.fields.slug}`,
    category: node.fields.categories[0].fields,
    customerLogo: node.fields.customerLogo.fields.file,
  }
}

function parseEventTeaserFields(node) {
  return {
    url: `${node.fields?.urlSubfolder}${node.fields?.slug}`,
    teaserImage: node.fields?.teaserImage?.fields?.file,
    teaserText: node.fields?.description,
    headline: node.fields?.headline
  }
}

function parsePartnerTeaserFields(node) {
  return {
    ...node.fields,
    url: `${node.fields.urlSubfolder}${node.fields.slug}`,
    category: node.fields.categories[0].fields,
    logo: node.fields.logo.fields.file,
  }
}

function parseCompanyNewsTeaserFields(node) {
  return {
    ...node.fields,
    url: `${node.fields.urlSubfolder}${node.fields.slug}`,
    category: node.fields.categories[0].fields,
    image: node.fields.image.fields.file,
  }
}
