import * as contentful from 'contentful-management';
import consola from "consola";
import {Entry, Environment} from "contentful-management/types";

const DEFAULT_BACKGROUND = 'white';

async function main() {
  const client = contentful.createClient({ accessToken: '' });
  const space = await client.getSpace('');
  const environment = await space.getEnvironment('');

  const contentTypes = await environment.getContentTypes();
  for (const contentType of contentTypes.items) {
    const backgroundField = contentType.fields.find(field => field.id === 'background');
    const designOptionsField = contentType.fields.find(field => field.id === 'designOptions');
    if (backgroundField && designOptionsField) {
      consola.info(`Updating entries of content type... ${contentType.sys.id}`);
      await migrateBackgroundOfContentType(environment, contentType.sys.id);
    }
  }
}

async function getCurrentBackgroundValue(environment: Environment, entry: Entry): Promise<string> {
  const backgroundEntryId = entry?.fields?.background?.en?.sys?.id;
  if (!backgroundEntryId) {
    return DEFAULT_BACKGROUND;
  }

  try {
    const backgroundEntry = await environment.getEntry(backgroundEntryId);
    return backgroundEntry.fields.name.en;
  } catch {
    return DEFAULT_BACKGROUND;
  }
}

async function getDesignOptionsEntry(environment: Environment, parentId: string, parentInternalName: string, background: string): Promise<Entry> {
  const designOptionEntryId = `designOption_${parentId}`;
  let entry = await environment.getEntry(`designOption_${parentId}`).catch(_ => undefined);
  if (entry) {
    return entry;
  }

  entry = await environment.createEntryWithId('moduleDesignOptions', designOptionEntryId, {
    fields: {
      name: { en: `${parentInternalName} design options` },
      background: { en: background },
      backgroundDirection: { en: 'vertical' },
      diverShape: { en: 'none' },
      spiderweb: { en: 'none' },
    },
  });

  return entry.publish();
}

async function migrateBackgroundOfContentType(environment: Environment, contentTypeId: string) {
  const entries = await environment.getEntries({ content_type: contentTypeId, limit: 1000 });
  for (const [index, entry] of entries.items.entries()) {
    if (entry.fields.designOptions) {
      consola.info(`${entry.sys.id} [${index + 1} / ${entries.total}] => skipped (already has design options)`);
      continue;
    }

    const entryWasPublished = entry.isPublished();

    const backgroundValue = await getCurrentBackgroundValue(environment, entry);
    consola.info(`${entry.sys.id} [${index + 1} / ${entries.total}] => ${backgroundValue}`);

    const entryName = entry?.fields?.name?.en;
    if (!entryName) {
      continue;
    }

    const designOptionsEntry = await getDesignOptionsEntry(environment, entry.sys.id, entryName, backgroundValue);

    entry.fields.designOptions = {
      en: {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: designOptionsEntry.sys.id,
        }
      }
    };

    consola.info(`${entry.sys.id} [${index + 1} / ${entries.total}] => updating...`);
    const updatedEntry = await entry.update().catch(_ => {
      consola.warn(`${entry.sys.id} [${index + 1} / ${entries.total}] => CANNOT BE UPDATED`);
    });

    if (updatedEntry && entryWasPublished) {
      consola.info(`${entry.sys.id} [${index + 1} / ${entries.total}] => publishing...`);
      await updatedEntry.publish().catch(_ => {
        consola.warn(`${entry.sys.id} [${index + 1} / ${entries.total}] => CANNOT BE PUBLISHED`);
      });
    }

    consola.info(`${entry.sys.id} [${index + 1} / ${entries.total}] => done.`);
  }
}

main().catch(consola.error);
