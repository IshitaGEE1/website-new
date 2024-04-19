<template>
  <section :class="['u-customer-teaser-card', 'cut-off-shape']">
    <div class="u-customer-teaser-card__body">
      <contentful-image
        class="u-customer-teaser-card__image-wrapper"
        v-bind="customerLogo"
        :width="480"
        :height="270"
        lazy
        :fit="fitOption"
        v-if="customerLogo"
      />

      <markdown-text class="u-customer-teaser-card__text" :text="teaserText" v-if="teaserText"/>
    </div>

    <div class="u-customer-teaser-card__footer">
      <navigation-button class="u-customer-teaser-card__action" :url="localePath(url)" data-type="tertiary">
        {{ ctaLabel }}
      </navigation-button>
    </div>
  </section>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import MarkdownText from '../atom/MarkdownText';
import ContentfulImage, { FitOptions } from '../_contentful/ContentfulImage';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import NavigationButton from '../atom/NavigationButton';

export default {
  name: 'CustomerTeaserCard',
  components: { NavigationButton, ContentfulPageLink, ContentfulImage, MarkdownText, BaseImage },
  props: {
    url: String,
    category: Object,
    customerLogo: Object,
    teaserText: String,
    teaserCtaLabel: String,
    headline: String,
    videoUrl: String,
  },
  data() {
    return {
      fitOption: FitOptions.PAD
    }
  },
  computed: {
    ctaLabel() {
      return this.teaserCtaLabel || (this.videoUrl ? 'Watch video' : 'Read more');
    }
  }
}
</script>

<style scoped lang="scss">
.u-customer-teaser-card {
  display: grid;
  grid-auto-rows: 1fr auto auto;
  @extend %teaserCard;
  padding: 2rem;
  background-color: #fff;
  height: 100%;

  &__text {
    text-align: center;
  }

  &__footer {
    text-align: center;
    margin-top: 1.25rem;
  }
}
</style>
