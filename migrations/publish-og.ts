import * as contentful from "contentful-management";
import consola from "consola";

const ACCESS_TOKEN = '';
const SPACE_ID = '';
const ENVIRONMENT_NAME = '';

async function main() {
  const client = contentful.createClient({
    accessToken: ACCESS_TOKEN,
    headers: {
      'x-contentful-enable-alpha-feature': 'assembly-types,annotations'
    }
  });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT_NAME);

  const ogEntriyCollection = await environment.getEntries({ content_type: 'openGraphMetaData', limit: 1000 });
  const ogEntries: contentful.Entry[] = ogEntriyCollection.items;

  let i = 0;
  for (const ogEntry of ogEntriyCollection.items) {
    consola.info(`${++i}/${ogEntriyCollection.total}`);
    await ogEntry.publish();
  }
}

main().then(() => consola.info('DONE :D')).catch(consola.fatal);
