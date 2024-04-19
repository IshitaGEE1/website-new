<template>
  <base-link :url="url" :label="label" :external="external"></base-link>
</template>

<script>
import BaseLink from '../_base/BaseLink';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'CategoryLink',
  components: { BaseLink },
  mixins: [ContentfulElementMixin],
  props: {
    categoryLabel: String
  },
  computed: {
    label() {
      if (this.categoryLabel) {
        return this.fields?.label?.replace('{{ category }}', this.categoryLabel);
      }
      return this.fields?.label;
    },
    contentType() {
      return this.fields?.link?.sys?.contentType?.sys?.id;
    },
    url() {
      let url = '#';

      if(Object.values(ContentTypes.pages).includes(this.contentType)) {
        const item = this.fields?.link?.fields;
        url = item?.urlSubfolder + item?.slug;
        url = InternalLinkService.processLink(this.localePath({ path: url }));
      } else if(ContentTypes.elements.externalLink === this.contentType) {
        url = this.fields?.link?.fields?.url;
      }
      return url;
    },
    external() {
      return this.contentType === ContentTypes.elements.externalLink;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
