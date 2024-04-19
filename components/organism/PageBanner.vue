<template>
  <section
    :class="['u-content-type', 'u-content-type--banner', 'u-page-banner', `u-page-banner--${direction}`, 'diver-shape']"
    :style="disableBackground ? undefined : 'background: var(--page-banner);'"
  >
    <div class="u-page-banner__body">
      <contentful-image
        class="u-page-banner__image-wrapper"
        v-bind="image"
        :width="imageWidth"
        :height="imageHeight"
        v-if="image"
      />

      <div class="u-page-banner__content">
        <base-surline class="u-page-banner__surline" v-if="surHeadline">
          {{ surHeadline }}
        </base-surline>

        <base-headline tag="h1" class="u-page-banner__headline" :text="headline" v-if="headline">
          {{ headline }}
        </base-headline>

        <base-subline class="u-page-banner__subline" v-if="subHeadline">
          {{ subHeadline }}
        </base-subline>

        <component class="u-page-banner__action" :is="actionType" v-bind="action" v-if="action"/>
      </div>
    </div>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSurline from '../_base/BaseSurline';
import BaseSubline from '../_base/BaseSubline';

export default {
  name: 'PageBanner',
  components: { BaseSubline, BaseSurline, BaseHeadline, ContentfulImage },
  mixins: [ContentfulModuleMixin, DynamicKeywordObserver],
  props: {
    imageWidth: {
      type: [String, Number],
      required: false,
      default: 650
    },
    imageHeight: {
      type: [String, Number],
      required: false,
      default: 500
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    direction() {
      return this.fields?.direction || this.options?.direction;
    },
    image() {
      return this.fields?.image || this.options?.image;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.fields?.action?.sys?.contentType?.sys?.id;
    },
    headline() {
      return this.fields?.headline || this.options?.headline;
    },
    subHeadline() {
      return this.fields?.subHeadline || this.options?.subHeadline;
    },
    surHeadline() {
      return this.fields?.surHeadline || this.options?.surHeadline;
    },
    disableBackground() {
      return this.fields?.disableBackground || false;
    }
  }
}
</script>

<style scoped lang="scss">
.u-page-banner {

  &__body {
    @include media-breakpoint-up($device-min-width-tablet) {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__image-wrapper {
    @include media-breakpoint-less-than($device-max-width-mobile) {
      margin-bottom: 1.875rem;
    }

    @include media-breakpoint-up($device-min-width-tablet) {
      flex: 2;
    }
  }

  &__content {
    @include media-breakpoint-up($device-min-width-tablet) {
      width: 40%;
    }
  }

  &__headline {
    margin-bottom: 1.25rem;
  }

  &__action {
    @include media-breakpoint-up($device-min-width-tablet) {
      margin-top: 2.5rem;
    }
  }

  &--image-right {
    .u-page-banner__image-wrapper {
      order: 2;
      margin-left: 2.5rem;
    }
  }

  &:not(&--image-right) {
    .u-page-banner__image-wrapper {
      margin-right: 2.5rem;
    }
  }
}
</style>
