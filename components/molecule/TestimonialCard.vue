<template>
  <article class="u-testimonial-card cut-off-shape theme-colored">
    <contentful-image
      class="u-testimonial-card__logo"
      v-bind="companyLogo"
      width="180"
      height="180"
      lazy
      fit="PAD"
      v-if="companyLogo"
    />

    <div class="u-testimonial-card__quoted">
      <contentful-image
        class="u-testimonial-card__avatar"
        v-bind="image"
        width="80"
        height="80"
        lazy
        fit="FILL"
        v-if="image"
      />

      <div class="u-testimonial-card__author">
        <div class="u-testimonial-card__name">{{ author }}</div>
        <div class="u-testimonial-card__position">{{ position }}</div>
      </div>
    </div>

    <markdown-text :text="quote" class="u-testimonial-card__text" v-if="quote"/>
  </article>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import MarkdownText from '../atom/MarkdownText';
import ImageSizes from '../../assets/js/enums/ImageSizes';
import ContentfulImage from '../_contentful/ContentfulImage';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'TestimonialCard',
  components: { ContentfulImage, MarkdownText, BaseImage },
  mixins: [ContentfulElementMixin],
  data() {
    return {
      imageSize: ImageSizes.LARGE,
      companyLogoSize: ImageSizes.SMALL
    }
  },
  computed: {
    image() {
      return this.fields?.image;
    },
    quote() {
      return this.fields?.quote;
    },
    author() {
      return this.fields?.author;
    },
    position() {
      return this.fields?.position;
    },
    companyLogo() {
      return this.fields?.companyLogo;
    }
  }
}
</script>

<style scoped lang="scss">
.u-testimonial-card {
  min-height: 440px;
  position: relative;
  color: var(--text-color);
  background-image: linear-gradient(90deg, var(--purple), var(--blue-vibrant));

  padding-top: 4rem;
  padding-bottom: 4rem;
  display: grid;
  grid-template-rows: auto auto auto auto;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 24px;
  grid-template-areas:
      ". logo logo logo logo ."
      ". quoted quoted quoted quoted ."
      ". text text text text .";

  @include tablet {
    grid-template-areas:
      ". . logo logo . ."
      ". . quoted quoted . ."
      ". text text text text .";
  }

  @include desktop {
    display: grid;
    grid-template-rows: auto auto auto auto;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 24px;
    grid-template-areas:
      ". . logo logo . text text text text text text ."
      ". . logo logo . text text text text text text ."
      ". . quoted quoted quoted text text text text text text ."
      ". . quoted quoted quoted text text text text text text .";
  }

  &__logo {
    grid-area: logo;
    justify-self: center;
    margin-bottom: 0.6875rem;
  }

  &__quoted {
    grid-area: quoted;
    display: flex;
    gap: 1.375rem;
    justify-content: space-between;
    align-items: center;

    @include tablet-below {
      margin-top: 40px;
    }
  }

  &__author {
    flex-grow: 1;
  }

  &__avatar {
  }

  &__name {
    font-weight: bold;
  }

  &__position {
    font-size: 0.75rem;
    line-height: 1.375em;
  }

  &__text {
    grid-area: text;
    align-self: center;
    font-size: 1.375rem;
    line-height: 1.18em;

    ::v-deep p {
      margin-top: unset;
    }

    @include tablet-below {
      margin-top: 60px;
    }
  }
}
</style>
