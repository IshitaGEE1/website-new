const axios = require('axios');
const { createContentfulConfiguration } = require('./contentfulConfiguration');
const { queries } = require('./graphql/queries');

function buildPayload(query, variables) {
  return JSON.stringify({
    query,
    variables
  });
}

function buildHeaders(accessToken) {
  return {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

function toCategoryLink(title, urlSubfolder, slug) {
  return {
    fields: {
      label: title,
      link: {
        sys: {
          contentType: {
            sys: {
              id: 'articlePage'
            }
          }
        },
        fields: {
          urlSubfolder,
          slug
        }
      }
    }
  };
}

/**
 * Client and ACL to the GraphQL API of contentful.
 */
class GraphQlClient {

  constructor(config) {
    this.config = config;
    this.preview = process.env.CTF_PREVIEW;
  }

  async executeQuery(query, vars = {}) {
    const payload = buildPayload(query, { preview: this.preview, ...vars });
    const headers = buildHeaders(this.config.accessToken);
    const space = this.config.space;
    const environment = this.config.environment;
    const url = `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}`;

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data.data;
    } catch (err) {
      console.error('cannot execute query', query, err);
      throw err;
    }
  }

  /**
   * Finds the latest blog posts with the given category.
   *
   * @param {string} categoryName Name of the category to filter by
   * @param {number} amount Max amount of articles to find
   * @param {string} currentPageId Article id to be excluded in the result set
   * @param {string} locale
   */
  async getLatestBlogPostsByCategoryAsCategoryLinks(categoryName, amount, currentPageId, locale = 'en') {
    try {
      const response = await this.executeQuery(queries.BlogPostsByCategory, {
        locale,
        categoryName,
        amount: amount + 1
      });

      return response.articlePageCollection.items
        .filter(page => page.sys.id !== currentPageId)
        .map(page => toCategoryLink(page.title, page.urlSubfolder, page.slug))
        .slice(0, amount);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getBlogPostAmount(locale = 'en') {
    try {
      const response = await this.executeQuery(queries.BlogPostAmount, { locale });
      return response.articlePageCollection.total;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getBlogPostPagesChunk(amount, skip, locale = 'en') {
    try {
      const response = await this.executeQuery(queries.AllBlogPosts, { locale, amount, skip });
      return response.articlePageCollection.items;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getBlogPostPages(amount, locale = 'en') {
    const chunkSize = 100;
    const promises = [];
    for (let skip = 0; skip < amount; skip += chunkSize) {
      promises.push(this.getBlogPostPagesChunk(chunkSize, skip, locale));
    }
    return (await Promise.all(promises)).flat();
  }

  async getAllBlogPostPages(locale = 'en') {
    const amount = await this.getBlogPostAmount();
    return this.getBlogPostPages(amount, locale);
  }

  async getGlossaryPagesByRange(locale = 'en', range) {
    if (!range) {
      return this.getGlossaryPageReferencesGrouped(locale);
    }

    const rangeParts = range.split('-');
    const chars = genCharArray(rangeParts[0], rangeParts[1]);

    const response = await this.executeQuery(queries.AllGlossaryPages, { locale });
    const items = response.glossaryTermPageCollection.items
      .map(item => ({
        headline: item.headline,
        url: this.buildUrlFromPage(item)
      })).sort((e1, e2) => e1.headline > e2.headline ? 1 : -1);

    return items
      .filter(item => chars.includes(item.headline.charAt(0).toUpperCase()))
      .reduce((result, page) => {
        const key = page.headline.charAt(0).toUpperCase();
        result[key] = [...result[key] || [], page];
        return result;
      }, {});
  }

  /**
   * Loads references to glossary pages, containing the keyword of the glossary page and the URL.
   *
   * @param {string} locale Locale context to search in, default is 'en'
   * @param {string | undefined} categoryId Optional category filter
   */
  async getGlossaryPageReferences(locale = 'en', categoryId = undefined) {
    const graphQlCategories = await this.queryGlossaryPageReferences(locale, categoryId);

    return graphQlCategories.glossaryTermPageCollection.items
      .map(item => ({
        headline: item.headline,
        url: this.buildUrlFromPage(item)
      })).sort((e1, e2) => e1.headline > e2.headline ? 1 : -1);
  }

  /**
   * Loads references to glossary pages, containing the keyword of the glossary page and the URL.
   * Afterwards they get grouped by first letter of headline.
   *
   * @param {string} locale Locale context to search in, default is 'en'
   * @param {string | undefined} categoryId Optional category filter
   */
  async getGlossaryPageReferencesGrouped(locale = 'en', categoryId = undefined) {
    return this.getGlossaryPageReferences(locale, categoryId).then(r => r.reduce((result, page) => {
      const key = page.headline.charAt(0).toUpperCase();
      result[key] = [...result[key] || [], page];

      return result;
    }, {}));
  }

  async queryGlossaryPageReferences(locale, categoryId) {
    if (categoryId)
      return this.executeQuery(queries.GlossaryPagesByCategoryId, { locale, categoryId });
    else
      return this.executeQuery(queries.GlossaryPages, { locale });
  }

  async getGlossaryListingGroups(locale = 'en') {
    const response = await this.executeQuery(queries.GlossaryListGroups, { locale });
    return response.glossaryListingGroupPageCollection.items
      .map(item => ({
        label: item.slug,
        url: this.buildUrlFromPage(item)
      })).sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
  }

  async getBlogPostsTeaserByCategory(locale = 'en', category, preview = false, amount = 3) {
    const response = await this.executeQuery(queries.LatestBlogPostTeasersByCategory, {
      category,
      locale,
      preview,
      amount
    });
    return response.articlePageCollection.items.map(item => ({
      ...item,
      tags: item?.tags?.items,
      url: this.buildUrlFromPage(item)
    }));
  }

  async getBlogPostTeasers(locale = 'en', preview = false, limit = 1000) {
    const response = await this.executeQuery(queries.BlogPostTeasers, { locale, preview, limit });
    return response.articlePageCollection.items.map(item => ({
      ...item,
      tags: item?.tags?.items,
      url: this.buildUrlFromPage(item)
    })).filter(item => item.url);
  }

  async getCustomerTeasers(locale = 'en', preview = false, limit = 1000) {
    const response = await this.executeQuery(queries.CustomerTeasers, { locale, preview, limit });
    return response.customerPageCollection.items.map(item => ({
      ...item,
      url: this.buildUrlFromPage(item),
      category: item.category.items[0]
    })).filter(item => item.url);
  }

  async getEventTeasers(locale = 'en', preview = false, limit = 1000) {
    const response = await this.executeQuery(queries.EventTeasers, { locale, preview, limit });
    return response.eventPageCollection.items.map(item => ({
      ...item,
      url: this.buildUrlFromPage(item)
    })).filter(item => item.url);
  }

  async getPartnerTeasers(locale = 'en', preview = false, limit = 1000) {
    const response = await this.executeQuery(queries.PartnerTeasers, { locale, preview, limit });
    return response.partnerPageCollection.items.map(item => ({
      ...item,
      url: this.buildUrlFromPage(item),
      category: item.category.items[0]
    })).filter(item => item.url);
  }

  buildUrlFromPage(page) {
    if (!page) {
      return '';
    }
    return page.urlSubfolder + page.slug;
  }

  /**
   * Gets a header entry from contentful
   * @param headerId ID of the header
   * @param locale locale for the header, default is 'en'
   * @return {Promise<void>} Promise of the header as a JSON-Object
   */
  async getPageHeader(headerId, locale = 'en') {
    const rawResponse = await this.executeQuery(queries.Header, { headerId, locale });
    this.flattenElementCollection(rawResponse);
    return rawResponse.modulePageHeader;
  }

  /**
   * Gets a footer entry from contentful
   * @param footerId ID of the footer
   * @param locale locale for the header, default is 'en'
   * @return {Promise<void>} Promise of the header as a JSON-Object
   */
  async getPageFooter(footerId, locale = 'en') {
    const rawResponse = await this.executeQuery(queries.Footer, { footerId, locale });
    this.flattenElementCollection(rawResponse);
    return rawResponse.modulePageFooter;
  }

  flattenElementCollection(obj) {
    if (obj.elementsCollection) {
      obj.items = obj.elementsCollection.items
      delete obj.elementsCollection;
    }
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === 'object') {
        this.flattenElementCollection(obj[key]);
      }
    }
  }

  async getChannelOverviewPages(locale = 'en', preview = false) {
    const limit = 500;
    let skip = 0;
    let result = [];
    let total = 0;

    do {
      const response = await this.executeQuery(queries.ChannelOverviewPages, {
        locale,
        preview,
        limit,
        skip
      });
      skip += limit;
      total = response.channelOverviewPageCollection.total;
      result.push(...response.channelOverviewPageCollection.items);
    } while (total > result.length)

    return result;
  }

  async getSupportedChannels(top = null, locale = 'en', preview = false) {
    const limit = 500;
    let skip = 0;
    let result = [];
    let total = 0;

    do {
      const response = await this.executeQuery(queries.SupportedChannels, {
        locale,
        preview,
        limit,
        skip,
        top
      });
      skip += limit;
      total = response.supportedChannelCollection.total;
      result.push(...response.supportedChannelCollection.items
        .map(resolveChannelPageCategories)
        .map(resolveLinkedChannelPage));
    } while (total > result.length)

    return result;
  }

  async getExportChannels(locale = 'en', preview = false, name) {
    const limit = 500;
    let skip = 0;
    let result = [];
    let total = 0;

    do {
      const response = await this.executeQuery(queries.ExportChannels, {
        locale,
        preview,
        limit,
        skip,
        name
      });
      skip += limit;
      total = response.exportChannelCollection.total;
      result.push(...response.exportChannelCollection.items.map(resolveLinkedChannelPage));
    } while (total > result.length)

    return result;
  }

  async getChannelCategories(locale = 'en', preview = false) {
    const limit = 500;
    let skip = 0;
    let result = [];
    let total = 0;

    do {
      const response = await this.executeQuery(queries.ChannelCategories, {
        locale,
        preview,
        limit,
        skip
      });
      skip += limit;
      total = response.channelCategoryCollection.total;
      result.push(...response.channelCategoryCollection.items.map(resolveLinkedChannelCategoryPage));
    } while (total > result.length)

    return result;
  }

  async getChannelsByCategory(locale = 'en', preview = false, categoryName) {
    const limit = 500;
    let skip = 0;
    let result = [];
    let total = 0;

    do {
      const response = await this.executeQuery(queries.ChannelsByCategory, {
        locale,
        preview,
        limit,
        skip
      });
      const entry = response.channelCategoryCollection?.items[0]?.linkedFrom?.supportedChannelCollection;
      skip += limit;
      total = entry.total;
      result.push(...entry.items.map(i => {
        const entry = i.linkedFrom?.channelPageCollection?.items[0];
        return {
          name: i.name,
          url: entry ? entry.urlSubfolder + entry.slug: undefined
        }
      }));
    } while (total > result.length)

    return result;
  }
}

function resolveChannelPageCategories(item) {
  let copy = Object.assign({}, {
    ...item,
    categories: item.categoriesCollection?.items.map(i => i.name)
  });
  delete copy.categoriesCollection;
  return copy;
}

function resolveLinkedChannelPage(item) {
  const supportedChannelEntry= item.linkedFrom?.supportedChannelCollection?.items[0]?.linkedFrom?.channelPageCollection?.items[0];

  let copy = Object.assign({}, {
    ...item,
    channel: {
      name: item.linkedFrom?.supportedChannelCollection?.items[0]?.name,
      url: supportedChannelEntry ? supportedChannelEntry.urlSubfolder + supportedChannelEntry.slug : undefined
    },
    slug: item.linkedFrom?.channelPageCollection?.items[0]?.slug
  });
  delete copy.linkedFrom;
  return copy;
}

function resolveLinkedChannelCategoryPage(item) {
  const linkedEntry = item.linkedFrom?.channelCategoryPageCollection?.items[0];
  let url = linkedEntry ? linkedEntry.urlSubfolder + linkedEntry.slug : undefined;

  let copy = Object.assign({}, {
    ...item,
    url
  });
  delete copy.linkedFrom;
  return copy;
}

function genCharArray(charA, charZ) {
  let a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }
  return a;
}

/**
 * Creates a new instance of a contentful graphql client.
 *
 * @return {GraphQlClient}
 */
function createGraphQlClient() {
  const config = createContentfulConfiguration();
  return new GraphQlClient(config);
}

module.exports = {
  GraphQlClient,
  createGraphQlClient
};
