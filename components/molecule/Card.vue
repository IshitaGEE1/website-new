<template>
  <div :class="['u-card', `u-card--align-${textAlign}`, { 'cut-off-shape': cardShadow, 'u-card--image-stretched': imageStretched, 'theme-light': cardShadow}]">
    <contentful-image
      class="u-card__image-wrapper"
      v-bind="image"
      :size="imageSize"
      :width="480"
      :height="270"
      lazy
      :cover="imageStretched"
      :fit="fitOption"
      v-if="image"
    />

    <div class="u-card__body">
      <base-headline
        tag="h3"
        :class="['u-card__headline', { 'u-card__headline--prominent': headlineProminent }]"
        :text="headline"
        v-if="headline"
      >
        {{ headline }}
      </base-headline>

      <markdown-text :text="text" class="u-card__text" v-if="text"/>

      <div  class="u-card__action" v-if="action">
        <component :is="actionType" v-bind="action" :contrast="cardShadow"/>
      </div>
    </div>
  </div>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import MarkdownText from '../atom/MarkdownText';
import ImageSizes from '../../assets/js/enums/ImageSizes';
import TextAligns from '../../assets/js/enums/TextAligns';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import ContentfulImage, { FitOptions } from '../_contentful/ContentfulImage';
import BaseHeadline from '../_base/BaseHeadline';

export default {
  name: 'Card',
  mixins: [ContentfulElementMixin],
  components: { BaseHeadline, ContentfulImage, MarkdownText, BaseImage },
  props: {
    borderEnabled: Boolean
  },
  data() {
    return {
      fitOption: FitOptions.PAD
    }
  },
  computed: {
    headline() {
      return this.fields?.headline?.trim();
    },
    text() {
      return this.fields?.text;
    },
    image() {
      return this.fields?.image;
    },
    action() {
      const action = this.fields?.action;

      if(!action) {
        return;
      }
      return {
        ...this.fields?.action,
        fields: {
          ...this.fields?.action?.fields,
          type: 'tertiary'
        }
      };
    },
    actionType() {
      return this.fields?.action?.sys?.contentType?.sys?.id;
    },
    cardShadow() {
      return this.borderEnabled ||this.fields?.cardShadow;
    },
    imageStretched() {
      return this.fields?.imageStretched;
    },
    headlineProminent() {
      return this.fields?.headlineProminent;
    },
    textAlign() {
      return this.fields?.textAlign || TextAligns.LEFT;
    },
    imageSize() {
      return this.fields?.imageSize || ImageSizes.MEDIUM;
    }
  }
}
</script>

<style scoped lang="scss">
.u-card {
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: transparent;
  padding: 1.5rem;
  text-align: left;
  overflow: hidden;

  &.cut-off-shape {
    background-color: #fff;
  }

  &__image-wrapper {
    margin-bottom: 1.25rem;
  }

  &__body {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  &__headline {
    flex: 1;
    font-size: 1.75rem; //28px
    font-weight: 600;
    font-family: "Good Headline Pro", sans-serif;
    line-height: 1.2;
    margin-bottom: .7rem; //11.2px

    &.u-card__headline--prominent {
      font-size: 3rem;
      margin-bottom: 0.25rem;
    }
  }

  &__text {
    flex: 2;

    ::v-deep p {
      margin-top: unset;

      &:last-child {
        margin-bottom: unset;
      }
    }
  }

  &__action {
    margin-top: 1.875rem;
  }

  &--image-stretched {
    padding: unset;

    .u-card__body {
      margin: 0 1.5rem 1.5rem;
      justify-self: center;
    }
  }

  &--align-center {
    .u-card__body {
      text-align: center;
    }
  }
}
</style>
