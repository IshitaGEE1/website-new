<template>
  <base-link :class="['u-contentful-page-link']" :url="processedUrl" :external="false">
    <slot>{{ processedLabel }}</slot>
  </base-link>
</template>

<script>
import InternalLinkService from '../../assets/js/services/internalLink.service';
import BaseLink from '../_base/BaseLink';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'ContentfulPageLink',
  components: { BaseLink },
  mixins: [ContentfulElementMixin],
  props: {
    url: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    }
  },
  computed: {
    processedLabel() {
      return this.label || this.fields?.title;
    },
    processedUrl() {
      const url = this.url || this.fields?.urlSubfolder + this.fields?.slug;
      if(!url) {
        return undefined;
      }
      return InternalLinkService.processLink(this.localePath({ path: url }));
    }
  }
}
</script>

<style scoped></style>
