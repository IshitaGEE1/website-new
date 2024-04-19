<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-feature', `u-feature--${imageDirection}`, theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div class="u-feature__body">
      <contentful-image
        class="u-feature__image-wrapper"
        v-bind="image"
        width="640"
        height="360"
        lazy
        fit="PAD"
        v-if="image"
      />

      <div class="u-feature__content">
        <base-surline class="u-feature__surline" v-if="surHeadline">{{ surHeadline }}</base-surline>

        <base-headline tag="h2" class="u-feature__headline" :text="headline" v-if="headline">
          {{ headline }}
        </base-headline>

        <base-subline class="u-feature__subline" v-if="subHeadline">{{ subHeadline }}</base-subline>

        <markdown-text :text="text" class="u-feature__text" v-if="text"/>

        <div class="u-feature__element-wrapper" v-if="elements">
          <ul class="u-feature__element-list">
            <li v-for="element in elements" class="u-feature__element">
              <card v-bind="element" :key="`element_${element.sys.id}`" class="u-feature__card"/>
            </li>
          </ul>
        </div>

        <component class="u-feature__action" :is="actionType" v-bind="action" v-if="action"/>
      </div>
    </div>

    <collapsable v-bind="collapsable" v-if="collapsable"/>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BaseImage from '../_base/BaseImage';
import Collapsable from '../molecule/Collapsable';
import Card from '../molecule/Card';
import ImageDirections from '../../assets/js/enums/ImageDirections';
import MarkdownText from '../atom/MarkdownText';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSurline from '../_base/BaseSurline';
import BaseSubline from '../_base/BaseSubline';

export default {
  name: 'Feature',
  components: { BaseSubline, BaseSurline, BaseHeadline, ContentfulImage, MarkdownText, Collapsable, BaseImage, Card },
  mixins: [ContentfulModuleMixin, BackgroundMixin, DynamicKeywordObserver],
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
    surHeadline() {
      return this.fields?.surHeadline;
    },
    text() {
      return this.fields?.text;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    },
    elements() {
      return this.fields?.elements;
    },
    collapsable() {
      return this.fields?.collapsable;
    },
    imageDirection() {
      return this.fields?.imageDirection || ImageDirections.IMAGE_LEFT;
    }
  }
}
</script>

<style scoped lang="scss">
.u-feature {
  &__body {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 1.25rem;

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row nowrap;
      gap: 3.75rem;
    }
  }

  &__image-wrapper {
    @include media-breakpoint-up($device-min-width-tablet) {
      flex: 2
    }
  }

  &__content {
    @include media-breakpoint-up($device-min-width-tablet) {
      width: 40%;
    }
  }

  &__surline {
    margin-bottom: 0.625rem;
  }

  &__headline {
    margin-top: unset;
    margin-bottom: 1.25rem;
  }

  &__text {
    margin-top: 1.25rem;
  }

  &__action {
    margin-top: 2.5rem;
  }

  &__element-list {
    display: flex;
    flex-flow: column wrap;
    column-gap: $gutter-size;
    row-gap: 1rem;
    list-style: none;
    margin: unset;
    padding: unset;

    > * {
      flex: 1;
    }

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row wrap;
    }
  }

  @include media-breakpoint-up($device-min-width-tablet) {
    &--image-right {
      .u-feature__image-wrapper {
        order: 2;
      }
    }
  }

  &__card {
    padding: unset;

    ::v-deep h3 {
      color: $color-productsup-cta--red;
    }
  }
}
</style>
