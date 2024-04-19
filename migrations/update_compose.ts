import * as contentful from "contentful-management";
import consola from "consola";
import {ContentType, Entry, Environment, KeyValueMap} from "contentful-management/types";
import {ContentFields} from "contentful-management/dist/typings/entities/content-type-fields";
import {createLinkToEntry} from "./lib/cf_util";

const ACCESS_TOKEN = '';
const SPACE_ID = '';
const ENVIRONMENT_NAME = '';

const OPEN_GRAPH_CONTENT_TYPE_ID = 'openGraphMetaData';
const OPEN_GRAPH_FIELD_IDS = ['openGraphTitle', 'openGraphDescription', 'openGraphImage', 'additionalOpenGraphTags'];
const OPEN_GRAPH_REF_FIELD_ID = 'openGraphMetaData';

const COMPOSE_PAGE_CONTENT_TYPE_ID = 'page';
const PAGE_TYPES_TO_MIGRATE = [
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
  'landingPage'
];

class Migration {

  private readonly environment: Environment;
  private composePageFields: ContentFields<KeyValueMap>[] | undefined = undefined;

  public constructor(environment: Environment) {
    this.environment = environment;
  }

  public async runMigration() {
    await this.createOpenGraphContentType();
    await this.migratePageTypes();
    await this.updateLinks();
    await this.deleteComposePages();
    await this.deleteComposePageContentType();
  }

  public async createOpenGraphContentType() {
    const composePageFields = await this.getComposePageFields();
    const openGraphFields = composePageFields.filter(field => OPEN_GRAPH_FIELD_IDS.includes(field.id));

    const openGraphContentTypeExists = await this.environment.getContentType(OPEN_GRAPH_CONTENT_TYPE_ID)
      .then(() => true)
      .catch(() => false);

    if (openGraphContentTypeExists) {
      consola.info('Opengraph content type already exists.');
      return;
    }

    await this.environment.createContentTypeWithId(OPEN_GRAPH_REF_FIELD_ID, {
      name: 'OpenGraph Metadata',
      displayField: 'openGraphTitle',
      description: '',
      fields: openGraphFields
    }).then(type => type.publish());

    consola.info('Opengraph content type created.');
  }

  public async migratePageTypes() {
    for (const pageTypeId of PAGE_TYPES_TO_MIGRATE) {
      await this.transferComposePageFields(pageTypeId);
      await this.markAggregateRoot(pageTypeId);
      await this.transferComposePageValues(pageTypeId);
    }
  }

  private async transferComposePageFields(pageTypeId: string) {
    const pageType = await this.environment.getContentType(pageTypeId);
    const composePageFields = await this.getComposePageFields();
    let anyFieldAltered = false;

    composePageFields.forEach(composePageField => {
      if (OPEN_GRAPH_FIELD_IDS.includes(composePageField.id))
        return;

      if (pageType.fields.find(pageField => pageField.id === composePageField.id))
        return;

      pageType.fields.push(composePageField);

      anyFieldAltered = true;
      consola.info(`Field '${composePageField.id}' added to content type '${pageTypeId}'`)
    });

    if (!pageType.fields.find(field => field.id === OPEN_GRAPH_REF_FIELD_ID)) {
      pageType.fields.push({
        "id": OPEN_GRAPH_REF_FIELD_ID,
        "name": "Open Graph Metadata",
        "type": "Link",
        "localized": false,
        "required": false,
        "validations": [
          {
            "linkContentType": [
              OPEN_GRAPH_CONTENT_TYPE_ID
            ]
          }
        ],
        "disabled": false,
        "omitted": false,
        "linkType": "Entry"
      });

      anyFieldAltered = true;
      consola.info(`Field '${OPEN_GRAPH_REF_FIELD_ID}' added to content type '${pageTypeId}'`)
    }

    if (anyFieldAltered) {
      await pageType.update().then(type => type.publish());
      consola.info(`Content Type '${pageTypeId}' updated.`)
    } else {
      consola.info(`Nothing changed on Content Type '${pageTypeId}'.`)
    }
  }

  private async markAggregateRoot(pageTypeId: string) {
    const contentType = await this.environment.getContentType(pageTypeId);
    let metadataChanged = false;

    if (!contentType.metadata) {
      contentType.metadata = {};
    }

    if (!contentType.metadata.annotations) {
      contentType.metadata.annotations = {};
    }

    if (!contentType.metadata.annotations.ContentType) {
      contentType.metadata.annotations.ContentType = [];
    }

    if (!contentType.metadata.annotations.ContentType.find((item: any) => item?.sys?.id === 'Contentful:AggregateRoot')) {
      contentType.metadata.annotations.ContentType.push({
        sys: {
          id: "Contentful:AggregateRoot",
          type: "Link",
          linkType: "Annotation"
        }
      });
      metadataChanged = true;
    }

    if (metadataChanged) {
      await contentType.update().then(type => type.publish());
      consola.info(`Content type '${pageTypeId}' marked as aggregate root`)
    } else {
      consola.info(`Content type '${pageTypeId}' already marked as aggregate root`)
    }
  }

  private async transferComposePageValues(pageTypeId: string) {
    const pageEntriyCollection = await this.environment.getEntries({content_type: pageTypeId, limit: 1000});
    const pageEntries: Entry[] = pageEntriyCollection.items;
    consola.info(`Patching ${pageEntries.length} page entries of content type ${pageTypeId}`)

    for (const pageEntry of pageEntries) {
      const isPublished = pageEntry.isPublished();

      const composePageEntryCollection = await this.environment.getEntries({
        content_type: COMPOSE_PAGE_CONTENT_TYPE_ID,
        limit: 1,
        links_to_entry: pageEntry.sys.id,
      });

      if (composePageEntryCollection.total !== 1) {
        consola.warn(`Unambigous entry: '${pageEntry.sys.id}' [${composePageEntryCollection.total}]`);
        continue;
      }

      const composePageEntry = composePageEntryCollection.items[0];
      const composePageFieldKeys = Object.keys(composePageEntry.fields).filter(key => key != 'name' && key != 'content');
      let anyFieldsAltered = false;

      for (const composePageFieldKey of composePageFieldKeys) {
        if (OPEN_GRAPH_FIELD_IDS.includes(composePageFieldKey))
          continue;

        if (pageEntry.fields[composePageFieldKey])
          continue;

        pageEntry.fields[composePageFieldKey] = composePageEntry.fields[composePageFieldKey];
        anyFieldsAltered = true;
      }

      if (!pageEntry.fields[OPEN_GRAPH_REF_FIELD_ID]) {
        if (OPEN_GRAPH_FIELD_IDS.find(id => !!composePageEntry.fields[id])) {
          const ogEntryId = `og_${pageEntry.sys.id}`;

          if (!await this.environment.getEntry(ogEntryId).then(() => true).catch(() => false)) {
            let ogFields: any = {};
            OPEN_GRAPH_FIELD_IDS.forEach(ogFieldId => {
              ogFields[ogFieldId] = composePageEntry.fields[ogFieldId];
            });

            await this.environment.createEntryWithId(OPEN_GRAPH_CONTENT_TYPE_ID, ogEntryId, {
              fields: ogFields
            });
            consola.info(`opengraph metada created for ${pageTypeId}[${pageEntry.sys.id}]`);
          } else {
            consola.info(`opengraph metada already exist for ${pageTypeId}[${pageEntry.sys.id}]`);
          }

          pageEntry.fields[OPEN_GRAPH_REF_FIELD_ID] = {en: createLinkToEntry(ogEntryId)};
          anyFieldsAltered = true;
        } else {
          consola.info(`no need to create openGraphMetaData entry for ${pageTypeId}[${pageEntry.sys.id}]`);
        }
      }

      if (anyFieldsAltered) {
        await pageEntry.update().then(entry => isPublished ? entry.publish() : entry)
          .then(() => consola.info(`Page ${pageTypeId}[${pageEntry.sys.id}] updated.`))
          .catch(consola.error);
      } else {
        consola.info(`Page ${pageTypeId}[${pageEntry.sys.id}] unchanged.`)
      }
    }
  }

  public async updateLinks() {
    await this.updateLinkValidations();
    await this.replaceLinkReferences();
    await this.removePageValidations();
  }

  private async updateLinkValidations() {
    const contentTypes: ContentType[] = (await this.environment.getContentTypes()).items;
    for (const contentType of contentTypes) {
      let anyValidationAltered = false;
      for (const field of contentType.fields) {
        const validation = field.validations?.find(validation => validation.linkContentType?.includes('page'));
        if (validation) {
          for (const refType of PAGE_TYPES_TO_MIGRATE) {
            if (validation?.linkContentType?.includes(refType))
              continue;

            validation?.linkContentType?.push(refType);
            anyValidationAltered = true;
          }
        }


        const itemValidation = field.items?.validations?.find(validation => validation.linkContentType?.includes('page'));
        if (itemValidation) {
          for (const refType of PAGE_TYPES_TO_MIGRATE) {
            if (itemValidation?.linkContentType?.includes(refType))
              continue;

            itemValidation?.linkContentType?.push(refType);
            anyValidationAltered = true;
          }
        }
      }

      if (anyValidationAltered) {
        await contentType.update().then((type) => type.publish());
        consola.info(`Updated links of content type ${contentType.name}`)
      } else {
        consola.info(`No need to update content type ${contentType.name}`)
      }
    }
  }

  private async replaceLinkReferences() {
    const composePages: Entry[] = (await this.environment.getEntries({content_type: 'page', limit: 1000})).items;
    let k = 1;
    for (const composePage of composePages) {
      const currentRefId = composePage.sys.id;
      const newRefId = composePage.fields?.content?.en?.sys?.id;
      if (!newRefId)
        continue;

      const references: Entry[] = (await this.environment.getEntries({
        links_to_entry: currentRefId,
        limit: 1000
      })).items;

      consola.info(`Replacing References (Item ${k++}/${composePages.length}) (${references.length} references)`);

      for (const reference of references) {
        if (reference.isArchived())
          continue;

        let linkReplaced = false;

        for (const key of Object.keys(reference.fields)) {
          if (Array.isArray(reference.fields[key].en)) {
            for (const item of reference.fields[key].en) {
              if (item.sys?.id === currentRefId) {
                item.sys.id = newRefId;
                linkReplaced = true;
              }
            }
          } else {
            if (reference.fields[key].en?.sys?.id === currentRefId) {
              reference.fields[key].en.sys.id = newRefId;
              linkReplaced = true;
            }
          }
        }

        if (linkReplaced) {
          consola.info(`updating link(s) on entry ${reference.sys.id} (${currentRefId} --> ${newRefId})`);
          await reference.update().then((type) => type.publish()).catch(consola.error);
        }
      }
    }
  }

  private async removePageValidations() {
    const contentTypeCollection = await this.environment.getContentTypes();
    const contentTypes: ContentType[] = contentTypeCollection.items;
    for (const contentType of contentTypes) {
      let anyValidationAltered = false;
      for (const field of contentType.fields) {
        const validation = field.validations?.find(validation => validation.linkContentType?.includes('page'));
        if (!validation)
          continue;

        for (const refType of PAGE_TYPES_TO_MIGRATE) {
          if (validation?.linkContentType?.includes(refType))
            continue;

          validation.linkContentType = validation.linkContentType?.filter(e => e !== 'page');
          anyValidationAltered = true;
        }
      }

      if (anyValidationAltered) {
        console.dir(contentType, {depth: 10});
        await contentType.update().then((type) => type.publish());
        consola.info(`Removed links to compose:page of content type ${contentType.name}`)
      } else {
        consola.info(`No need to update content type ${contentType.name}`)
      }
    }
  }

  private async getComposePageFields(): Promise<ContentFields<KeyValueMap>[]> {
    if (!this.composePageFields) {
      const composePage = await this.environment.getContentType(COMPOSE_PAGE_CONTENT_TYPE_ID);
      this.composePageFields = composePage.fields.filter(field => field.id != 'name' && field.id != 'content');
    }

    return this.composePageFields;
  }

  private async deleteComposePages() {
    const pages = (await this.environment.getEntries({content_type: COMPOSE_PAGE_CONTENT_TYPE_ID, limit: 1000})).items;
    let k = 1;
    for (const page of pages) {
      if (page.isPublished()) {
        await page.unpublish().then(entity => entity.delete());
      } else {
        await page.delete();
      }
      consola.info(`deleted ${k++} of ${pages.length} pages`)
    }
  }

  private async deleteComposePageContentType() {
    this.environment.getContentType(COMPOSE_PAGE_CONTENT_TYPE_ID).then((pageTypeId) => {
      pageTypeId.unpublish().then(t => t.delete());
      consola.info(`compose:page removed`);
    }).catch(() => consola.info(`compose:page already gone`));
  }
}

async function main() {
  const client = contentful.createClient({
    accessToken: ACCESS_TOKEN,
    headers: {
      'x-contentful-enable-alpha-feature': 'assembly-types,annotations'
    }
  });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT_NAME);

  const migration = new Migration(environment);
  await migration.runMigration();
}

main().then(() => consola.info('DONE :D')).catch(consola.fatal);
