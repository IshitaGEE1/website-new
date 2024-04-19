<template>
  <base-cta :class="['u-download-button']" :url="url" v-bind="{secondary, tertiary, small}" :download="fileName" external>
    {{ label }}
  </base-cta>
</template>

<script>
import BaseCta, { Types } from '../_base/BaseCta';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'DownloadButton',
  components: { BaseCta },
  mixins: [ContentfulElementMixin],
  props: {
    small: Boolean
  },
  computed: {
    label() {
      return this.fields.label;
    },
    //Bynder assets
    asset() {
      if (!this.fields.asset || this.fields.asset.length < 1) {
        return undefined;
      }
      //for now only take first asset item
      return this.fields.asset[0];
    },
    url() {
      if (!this.asset) {
        return undefined;
      }
      //if file is not set to public -> only preview image available
      return !this.asset.isPublic ? this.asset.src : this.asset.original;
    },
    fileName() {
      return this.asset?.name;
    },
    secondary() {
      return this.fields?.type === Types.SECONDARY;
    },
    tertiary() {
      return this.fields?.type === Types.TERTIARY;
    }
  }
}
</script>

<style scoped lang="scss"></style>
