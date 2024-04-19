const contentful = require('../../plugins/contentful');
const Greenhouse = require("../../plugins/greenhouse");

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


async function generatePaths() {
  console.error("Generating all paths" + "\n");
  return generateAllPaths();
}

async function generateAllPaths() {
  const contentfulClient = contentful.createClient();

  const responses = await Promise.all(PAGE_TYPES.map(pageType => ({
    content_type: pageType,
    limit: 1000,
    include: 0,
    locale: '*'
  })).map(contentfulClient.getEntries));

  const results = responses.flatMap(r => r.items);

  console.log(`Pages to be generated: ${results.length}`);

  const contentfulPaths = await transformPagesToPaths(results).then(filterIndexPaths).catch(handleError);
  const greenhousePaths = (await Greenhouse.GreenhouseAdapter.getJobs()).map(job => {
    const normalizedName = job.title.replace('(m/f/d)', '').replace(/[^0-9a-zA-Z\-\s]/g, '').trim().toLowerCase().split(' ').join('-');
    return `/careers/open-roles/${normalizedName}-${job.id}/`;
  });

  return [
    ...contentfulPaths,
    ...greenhousePaths,
    '/careers/open-roles/'
  ];
}

async function filterIndexPaths(pages) {
  return pages.map(e => e.replace('index/', ''));
}

async function transformPagesToPaths(pages) {
  return pages.flatMap(transformPageToPath);
}

function transformPageToPath(page) {
  let paths = [];
  for (let lang in page.fields.slug) {
    const slug = page.fields.slug[lang];
    const urlSubfolder = page.fields.urlSubfolder[lang];
    if (!slug || !urlSubfolder)
      continue;
    const prefix = prefixFromLanguage(lang);
    paths.push(`${prefix}${urlSubfolder}${slug}/`)
  }
  return paths;
}

function prefixFromLanguage(language) {
  return language !== 'en' ? `/${language}` : '';
}

function handleError(error) {
  console.error(error);
  return ['/'];
}

module.exports = {generatePaths}
