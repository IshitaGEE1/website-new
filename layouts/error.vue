<template>
  <p v-if="$fetchState.pending">Fetching page...</p>
  <p v-else-if="$fetchState.error">An error occurred rendering the error page.</p>
  <div class="u-page" v-else>
    <component
      :is="item.contentType"
      v-for="(item) in content"
      :key="`${item.contentType}_${item.sys.id}`"
      v-bind="item"
    />
  </div>
</template>

<script>
import { createClient } from '../plugins/contentful';
import ContentTypes from '../assets/js/enums/ContentTypes';

const client = createClient();

export default {
  name: 'ErrorPage',
  props: ['error'],
  data() {
    return {
      content: Array
    }
  },
  async fetch() {
    const locale = this.$i18n.locale;

    this.content = await client.getEntries({
      content_type: ContentTypes.pages.core,
      'fields.slug': 'error',
      locale: locale,
      include: 10
    }).then((entries) =>
      Object.values(entries.items[0].fields)
        .filter(i => i instanceof Object)
        .flat()
        .map(i => ({
          ...i,
          contentType: i.sys.contentType.sys.id
        }))
    ).catch(console.error)
  }
};
</script>
