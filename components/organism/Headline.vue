<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-headline', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <base-surline class="u-headline__surline" :center="center" v-if="surline">{{ surline }}</base-surline>

    <base-headline class="u-headline__text" tag="h2" :center="center" v-if="headline">{{ headline }}</base-headline>

    <base-subline class="u-headline__subline" :center="center" v-if="subline">{{ subline }}</base-subline>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import TextAligns from '../../assets/js/enums/TextAligns';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSurline from '../_base/BaseSurline';
import BaseSubline from '../_base/BaseSubline';

export default {
  name: 'Headline',
  components: { BaseSubline, BaseSurline, BaseHeadline },
  mixins: [ContentfulModuleMixin, BackgroundMixin, DynamicKeywordObserver],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subline() {
      return this.fields?.subHeadline;
    },
    surline() {
      return this.fields?.surHeadline;
    },
    center() {
      return this.fields?.align === TextAligns.CENTER || TextAligns.LEFT;
    }
  }
}
</script>

<style scoped lang="scss">
.u-headline {
  &--center {
    text-align: center;
  }
}
</style>
