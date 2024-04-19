<template>
  <div
    :class="['u-content-type', 'u-content-type--module', 'u-markdown-area', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <markdown-text class="u-markdown-area__text" :text="text" v-if="text"></markdown-text>
  </div>
</template>

<script>
import MarkdownText from '../atom/MarkdownText';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';

export default {
  name: 'MarkdownArea',
  components: { MarkdownText },
  mixins: [ContentfulModuleMixin, DynamicKeywordObserver, BackgroundMixin],
  computed: {
    text() {
      return this.fields?.text;
    }
  }
}
</script>

<style scoped>

</style>
