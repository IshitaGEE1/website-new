<template>
  <section class="u-full-width-image-banner">
    <div class="u-full-width-image-banner__background" :style="backgroundStyle"></div>

    <div class="u-content-type u-content-type--banner u-full-width-image-banner__content">
      <div>
        <base-surline class="u-full-width-image-banner__surline" v-if="surline">{{ surline }}</base-surline>

        <base-headline tag="h1" class="u-full-width-image-banner__headline" :text="headline" v-if="headline">{{ headline }}</base-headline>

        <base-subline class="u-full-width-image-banner__subline" v-if="subline">{{ subline }}</base-subline>

        <component class="u-full-width-image-banner__action" :is="actionType" v-bind="action" v-if="action"/>
      </div>
    </div>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from "../_base/BaseHeadline";
import BaseSubline from "../_base/BaseSubline";
import BaseSurline from "../_base/BaseSurline";

export default {
  name: 'FullWidthImageBanner',
  components: {BaseSurline, BaseSubline, BaseHeadline},
  mixins: [ContentfulModuleMixin, DynamicKeywordObserver],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subline() {
      return this.fields?.subline;
    },
    surline() {
      return this.fields?.surline;
    },
    backgroundImageUrl() {
      return `${this.fields?.backgroundImage?.fields?.file?.url}?fm=webp&w=1200&h=675`;
    },
    backgroundStyle() {
      return {
        'background-image': `url(${this.backgroundImageUrl})`,
      }
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.fields?.action?.sys?.contentType?.sys?.id;
    },
  }
}
</script>

<style scoped lang="scss">
.u-full-width-image-banner {
  position: relative;
  height: calc(100vh - var(--height-header));
  max-height: 42.1875rem;

  @include media-breakpoint-up($device-min-width-desktop) {
    height: 42.1875rem;
  }

  &__background {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: brightness(0.5);
    z-index: -1;
  }

  &__content {
    position: relative;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    color: white;

    > * {
      color: inherit;
    }
  }

  &__action {
    @include media-breakpoint-up($device-min-width-tablet) {
      margin-top: 2.5rem;
    }
  }
}
</style>
