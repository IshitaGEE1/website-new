<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-image-with-text', `u-image-with-text--${direction}`, theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <base-headline tag="h2" class="u-image-with-text__headline" :text="headline" v-if="headline">{{ headline }}</base-headline>

    <base-subline class="u-image-with-text__sub-title" v-if="subTitle">{{ subTitle }}</base-subline>

    <div class="u-image-with-text__body">
      <contentful-image
        v-bind="image"
        class="u-image-with-text__image-wrapper"
        width="660"
        height="400"
        lazy
        v-if="image"
      />

      <div class="u-image-with-text__texts" v-if="texts">
        <template v-for="(item, index) in texts">
          <card v-bind="item" :key="`text-block_${index}`" class="u-image-with-text__text-block"/>
        </template>
      </div>
    </div>

    <div class="u-image-with-text__footer" v-if="action">
      <component :is="actionType" v-bind="action" class="u-image-with-text__action"/>
    </div>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import Card from '../molecule/Card';
import BaseImage from '../_base/BaseImage';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from "../_base/BaseHeadline";
import BaseSubline from "../_base/BaseSubline";

export default {
  name: 'ImageWithText',
  components: {BaseSubline, BaseHeadline, ContentfulImage, BaseImage, Card },
  mixins: [ContentfulModuleMixin, BackgroundMixin, DynamicKeywordObserver],
  computed: {
    direction() {
      return this.fields?.direction;
    },
    headline() {
      return this.fields?.headline;
    },
    subTitle() {
      return this.fields?.subTitle;
    },
    image() {
      return this.fields?.image;
    },
    button() {
      return this.fields?.button;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    },
    texts() {
      return this.fields?.texts;
    }
  }
}
</script>

<style scoped lang="scss">
.u-image-with-text {
  &__headline {
    @include media-breakpoint-up($device-min-width-tablet) {
      text-align: center;
    }
  }

  &__sub-title {
    @include media-breakpoint-up($device-min-width-tablet) {
      text-align: center;
    }
  }

  &__image-wrapper {
    margin: 2.5rem 0;

    @include media-breakpoint-up($device-min-width-desktop) {
      margin: 3.125rem 0 5rem;
    }
  }

  &__text-block {
    background: transparent;
    & + & {
      margin-top: 2.5rem;

      @include media-breakpoint-up($device-min-width-desktop) {
        margin-top: 5rem;
      }
    }
  }

  &__footer {
    text-align: center;
  }

  &__action {
    margin-top: 2.5rem;
  }

  &.u-image-with-text--vertical {

    @include media-breakpoint-up($device-min-width-tablet) {
      .u-image-with-text__texts {
        display: flex;
        gap: $gutter-size;

        > * {
          flex: 1;
          margin: unset;
        }
      }
    }
  }

  &.u-image-with-text--horizontal {
    @include media-breakpoint-up($device-min-width-tablet) {
      .u-image-with-text__body {
        display: flex;
        align-items: center;
        gap: $gutter-size;

        > * {
          flex: 1;
          margin: unset;
        }
      }

      .u-image-with-text__image-wrapper {
        order: 2;
      }
    }
  }
}
</style>
