import ContentTypes from '../enums/ContentTypes';

const ContentfulResponseHelper = {
  cleanupFields
}

export default ContentfulResponseHelper;

function cleanupFields(node, originPageId) {
  if (typeof node === 'object') {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        cleanupFields(node[i], originPageId);
      }
    } else if (node) {
      const contentType = node.sys?.contentType?.sys?.id;

      if (Object.values(ContentTypes.pages).includes(contentType)) {
        if (node.sys?.id === originPageId) {
          return;
        }
        delete node?.fields?.header;
        delete node?.fields?.banner;
        delete node?.fields?.modules;
        delete node?.fields?.footer;
        delete node?.fields?.seo;
      } else {
        let entries = Object.entries(node);

        for (let i = 0; i < entries.length; i++) {
          let key = entries[i][0];
          let value = entries[i][1];

          if (typeof value === 'object') {
            cleanupFields(value, originPageId);
          }
        }
      }
    }
  }
}

