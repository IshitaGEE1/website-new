<template>
  <section
    :class="['u-content-type', 'u-content-type--banner', 'u-page-banner', 'u-simple-page-banner']"
    :style="disableBackground ? undefined : 'background: var(--page-banner);'"
  >
    <div class="u-simple-page-banner__body">
      <base-headline tag="h1" class="u-simple-page-banner__headline" center :text="headline" v-if="headline">
        {{ headline }}
      </base-headline>

      <base-subline class="u-simple-page-banner__sub-headline" center v-if="subHeadline">
        {{ subHeadline }}
      </base-subline>

      <contentful-image
        class="u-simple-page-banner__image-wrapper"
        v-bind="image"
        width="1200"
        height="675"
        v-if="image"
      />
    </div>
  </section>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import ContentfulOrganismMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSubline from '../_base/BaseSubline';

export default {
  name: 'SimplePageBanner',
  components: { BaseSubline, BaseHeadline, ContentfulImage, BaseImage },
  mixins: [ContentfulOrganismMixin, DynamicKeywordObserver],
  computed: {
    image() {
      return this.fields?.image;
    },
    headline() {
      return this.fields?.headline;
    },
    subHeadline() {
      return this.fields?.subHeadline;
    },
    disableBackground() {
      return this.fields?.disableBackground || false;
    }
  }
}
</script>

<style scoped lang="scss">
.u-simple-page-banner {

  &__image-wrapper {
    margin-top: 3rem;
  }
}
</style>
