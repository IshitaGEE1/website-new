const contentful = require('../plugins/contentful');

const contentfulClient = contentful.createClient();

/**
 * Contentful preview mechanic for different languages.
 */
export default async function ({ route, redirect }) {
  if (route.path === '/preview' && route.query.sysId && route.query.lang) {
    try {
      const sysId = route.query.sysId;
      const lang = route.query.lang;
      const entry = await contentfulClient.getEntries({
        locale: lang,
        'sys.id': sysId
      }).then(e => e.items[0]);

      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      const subfolder = entry.fields.urlSubfolder;
      const slug = entry.fields.slug;

      let targetUrl = `${langPrefix}${subfolder}${slug}`;
      if (!targetUrl.endsWith('/'))
        targetUrl = `${targetUrl}/`;

      return redirect(targetUrl);
    } catch (e) {
      console.dir(e, { depth: 10 });
    }
  }
}
