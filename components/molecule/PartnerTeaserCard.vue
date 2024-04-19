<template>
  <contentful-page-link class="cut-off-shape" :url="url">
    <section class="u-partner-teaser-card">
      <contentful-image
        v-bind="logo"
        class="u-partner-teaser-card__image-wrapper"
        :width="480"
        :height="270"
        lazy
        :fit="fitOption"
        v-if="logo"
      />
    </section>
  </contentful-page-link>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import ContentfulImage, { FitOptions } from '../_contentful/ContentfulImage';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';

export default {
  name: 'PartnerTeaserCard',
  components: { ContentfulPageLink, ContentfulImage, BaseImage },
  props: {
    url: String,
    logo: Object,
    category: Object
  },
  data() {
    return {
      fitOption: FitOptions.PAD
    }
  }
}
</script>

<style scoped lang="scss">
.u-partner-teaser-card {
  @extend %teaserCard;
  padding: 2rem;
  background-color: #fff;
  text-align: center;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  & > * {
    &:not(:first-child) {
      margin-top: 1.25rem;
    }
  }

  &__content {
    text-align: center;
  }
}
</style>
