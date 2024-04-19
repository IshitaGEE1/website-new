const contentful = require('../../plugins/contentful');
const Greenhouse = require("../../plugins/greenhouse");

const STATIC_BLACKLIST = [
  '/en/customers/success-stories/',
  '/en/search/',
  '/en/careers/open-roles/',
  '/en/glossary/',
  '/index/',
  '/it/glossary/',
  '/fr/carriere/open-roles/',
  '/es/careers/open-roles/',
  '/de/careers/open-roles/',
  '/es/glossary/',
  '/it/careers/open-roles/',
  '/it/opportunita/posizioni-aperte/',
  '/es/index/',
  '/it/index/',
  '/de/index/',
  '/de/karriere/offene-stellen/',
  '/es/empleos/ofertas-de-trabajo-actuales/',
  '/fr/index/',
  '/de/glossary/',
  '/en/',
  '/fr/glossary/',
  '/fr/careers/open-roles/',
];

const PAGE_TYPES = [
  'articlePage',
  'companyNewsPage',
  'corePage',
  'customerPage',
  'eventPage',
  'glossaryCategoryPage',
  'glossaryListingGroupPage',
  'glossaryPage',
  'glossaryTermPage',
  'PartnerPage',
  'landingPage',
  'channelCategoryPage',
  'channelOverviewPage',
  'channelPage',
];

async function generateSiteMapRoutes() {
  const contentfulClient = contentful.createClient();

  const responses = await Promise.all(PAGE_TYPES.map(pageType => ({
    content_type: pageType,
    limit: 1000,
    include: 1,
    locale: '*'
  })).map(contentfulClient.getEntries));

  const results = responses.flatMap(toSiteMapObjects);

  const jobPaths = (await Greenhouse.GreenhouseAdapter.getJobs()).map(job => {
    const normalizedName = job.title.replace('(m/f/d)', '').replace(/[^0-9a-zA-Z\-\s]/g, '').trim().toLowerCase().split(' ').join('-');
    return `/careers/open-roles/${normalizedName}-${job.id}/`;
  });

  return [
    ...results,
    ...jobPaths,
    '/careers/open-roles/'
  ];
}

function isIndexed(item) {
  return item?.fields?.seo?.en?.fields?.no_index?.en !== true;
}

function toSiteMapObject(item) {
  let items = [];

  for (let lang in item.fields.slug) {
    const prefix = lang !== 'en' ? `/${lang}` : '';
    const urlSubfolder = item.fields.urlSubfolder[lang];
    const slug = item.fields.slug[lang];

    if (urlSubfolder && slug) {
      let url = `${prefix}${urlSubfolder}${slug}/`
      items.push({
        url: url,
        lastmod: item.sys.updatedAt
      })
    }
  }
  return items;
}

function toSiteMapObjects(response) {
  return response.items
    .filter(isIndexed)
    .flatMap(toSiteMapObject)
    .filter(item => !STATIC_BLACKLIST.includes(item.url));
}

module.exports = {generateSiteMapRoutes, STATIC_BLACKLIST}
