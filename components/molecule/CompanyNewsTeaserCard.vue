<template>
  <contentful-page-link :class="['u-company-news-teaser-card', 'cut-off-shape']" :url="url">
    <contentful-image
      class="u-company-news-teaser-card__image-wrapper"
      v-bind="image"
      :width="480"
      :height="270"
      lazy
      cover
      :fit="fitOption"
      v-if="image"
    />

    <div class="u-company-news-teaser-card__category">{{ category.label }}</div>

    <base-headline tag="h4" class="u-company-news-teaser-card__headline">{{ headline }}</base-headline>

    <div class="u-company-news-teaser-card__date">{{ processedPublishDate }}</div>
  </contentful-page-link>
</template>

<script>
import ContentfulImage, { FitOptions } from '../_contentful/ContentfulImage';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import BaseImage from '../_base/BaseImage';
import BaseHeadline from '../_base/BaseHeadline';

export default {
  name: 'CompanyNewsTeaserCard',
  components: { BaseHeadline, ContentfulPageLink, ContentfulImage, BaseImage },
  props: {
    url: String,
    category: Object,
    image: Object,
    headline: String,
    published: String
  },
  data() {
    return {
      fitOption: FitOptions.PAD
    }
  },
  computed: {
    processedPublishDate() {
      return new Date(this.published).toLocaleDateString(this.$i18n.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>

<style scoped lang="scss">
.u-company-news-teaser-card {
  @extend %teaserCard;
  @include set-box-shadow;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  background-color: #fff;
  text-align: left;
  text-decoration: none;
  overflow: hidden;

  &__category {
    margin-top: 1rem;
    padding: 0 1.25rem;
    color: var(--pink);
    font-weight: bold;
    font-size: 1.125rem;
  }

  &__headline {
    margin-top: unset;
    padding: 0 1.25rem;
    color: var(--dark-blue);
    flex: 1;
    font-size: 1.75rem; //28px
    font-weight: 600;
    font-family: "Good Headline Pro", sans-serif;
    line-height: 1.2;
  }

  &__date {
    padding: 0 1.25rem 1.25rem;
    font-size: 1rem;
    color: var(--text-color);
  }
}
</style>
