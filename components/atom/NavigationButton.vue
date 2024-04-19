<template>
  <base-cta class="u-navigation-button" :url="processedUrl" v-bind="{secondary, tertiary, small}" v-if="isPageObject">
    <slot>{{ processedLabel }}</slot>
  </base-cta>

  <base-cta class="u-navigation-button" :url="processedUrl" v-bind="{secondary, tertiary, small}" :external="external" v-else>
    <slot>{{ processedLabel }}</slot>
  </base-cta>
</template>

<script>
import BaseLink from '../_base/BaseLink';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import BaseCta, { Types } from '../_base/BaseCta';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'NavigationButton',
  components: { BaseCta, ContentfulPageLink, BaseLink },
  mixins: [ContentfulElementMixin],
  props: {
    dataType: {
      type: String
    },
    label: String,
    url: String,
    small: Boolean
  },
  computed: {
    processedLabel() {
      return this.label || this.fields?.label || this.fields?.title;
    },
    navigationObject() {
      return this.fields?.navigateTo || this.data;
    },
    isPageObject() {
      return Object.values(ContentTypes.pages).includes(this.navigationObject?.sys?.contentType?.sys?.id);
    },
    processedUrl() {
      if(this.url) {
        return InternalLinkService.processLink(this.url);
      }
      let url;

      if (this.isPageObject) {
        const item = this.navigationObject?.fields;
        url = InternalLinkService.processLink(this.localePath({ path: item?.urlSubfolder + item?.slug }));
      } else {
        url = this.navigationObject?.fields?.url;
      }
      return url;
    },
    secondary() {
      if(this.dataType) {
        return this.dataType === Types.SECONDARY;
      }
      return this.fields?.type === Types.SECONDARY;
    },
    tertiary() {
      if(this.dataType) {
        return this.dataType === Types.TERTIARY;
      }
      return this.fields?.type === Types.TERTIARY;
    },
    external() {
      return this.navigationObject?.fields?.external || false;
    }
  }
}
</script>


<style scoped lang="scss"></style>
