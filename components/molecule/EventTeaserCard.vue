<template>
  <contentful-page-link :class="['u-event-teaser-card', 'cut-off-shape']" :url="url">
    <contentful-image
      class="u-event-teaser-card__image-wrapper"
      v-bind="teaserImage"
      :width="480"
      :height="270"
      lazy
      cover
      :fit="fitOption"
      v-if="teaserImage"
    />

    <div class="u-event-teaser-card__content" v-if="date || headline || teaserText">
      <div class="u-event-teaser-card__date" v-if="date">{{ `Start: ${processedDate}` }}</div>

      <base-headline tag="h4" class="u-event-teaser-card__headline" v-if="headline">{{ headline }}</base-headline>
    </div>
  </contentful-page-link>
</template>

<script>
import ContentfulImage, { FitOptions } from '../_contentful/ContentfulImage';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import BaseImage from '../_base/BaseImage';
import BaseHeadline from "../_base/BaseHeadline";
import MarkdownText from '../atom/MarkdownText.vue';

export default {
  name: 'EventTeaserCard',
  components: { MarkdownText, BaseHeadline, ContentfulPageLink, ContentfulImage, BaseImage },
  props: {
    url: String,
    teaserImage: Object,
    image: Object,
    teaserText: String,
    headline: String,
    date: String,
  },
  data() {
    return {
      fitOption: FitOptions.FILL
    }
  },
  computed: {
    processedDate() {
      const startingDate = this.date

      if (!startingDate) {
        return undefined;
      }
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      let formattedDate = new Date(startingDate).toLocaleString(this.lang, dateOptions);

      return `${formattedDate}`;
    },
  }
}
</script>

<style scoped lang="scss">
.u-event-teaser-card {
  @extend %teaserCard;
  overflow: hidden;
  @include set-box-shadow;
  text-align: left;
  text-decoration: unset;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;

  & > * {
    &:not(:first-child) {
      margin-top: 1.25rem;
    }
  }

  &__content {
    padding: 0.5rem 1.25rem 1.25rem;
  }

  &__date {
    margin-top: 0.4375rem;
    color: var(--pink);
    font-weight: bold;
    font-size: 1.125rem;
  }

  &__headline {
    margin: unset;
    color: var(--dark-blue);
    flex: 1;
    font-size: 1.75rem; //28px
    font-weight: 600;
    font-family: "Good Headline Pro", sans-serif;
    line-height: 1.2;
  }

  &__text {
    margin-top: 0.4375rem;
    font-size: 1.125rem;
    color: var(--space-grey);
  }

  &__link {
    text-align: right;
  }
}
</style>
