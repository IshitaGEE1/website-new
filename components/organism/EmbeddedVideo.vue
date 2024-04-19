<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-embedded-video', `u-embedded-video--${videoDirection}`, theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div class="u-embedded-video__content">
      <div class="u-embedded-video__header">
        <base-headline class="u-embedded-video__headline" tag="h2" :text="headline" center v-if="headline">{{ headline }}</base-headline>
        <base-subline class="u-embedded-video__subline" v-if="subHeadline">{{ subHeadline }}</base-subline>
      </div>

      <base-youtube-wrapper
        class="u-embedded-video__video"
        :video-id="id"
        maxres
        inline
        v-if="isYoutube"
      ></base-youtube-wrapper>

      <base-vimeo-wrapper
        class="u-embedded-video__video"
        :video-id="id"
        maxres
        inline
        v-if="isVimeo"
      ></base-vimeo-wrapper>
    </div>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import BaseYoutubeWrapper from '../_base/BaseYoutubeWrapper';
import BaseVimeoWrapper from '../_base/BaseVimeoWrapper.vue';
import VideoPlatforms from '../../assets/js/enums/VideoPlatforms';
import VideoDirections from '../../assets/js/enums/VideoDirections';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from "../_base/BaseHeadline";
import BaseSubline from "../_base/BaseSubline";

export default {
  name: 'EmbeddedVideo',
  components: {BaseSubline, BaseHeadline, BaseYoutubeWrapper, BaseVimeoWrapper },
  mixins: [ContentfulModuleMixin, BackgroundMixin, DynamicKeywordObserver],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subHeadline() {
      return this.fields?.subHeadline;
    },
    id() {
      return this.fields?.videoId;
    },
    isYoutube() {
      return this.fields?.platform === VideoPlatforms.YOUTUBE;
    },
    isVimeo() {
      return this.fields?.platform === VideoPlatforms.VIMEO;
    },
    videoDirection() {
      if (!this.fields?.videoDirection) {
        return VideoDirections.BOTTOM
      }
      return this.fields.videoDirection;
    }
  }
}
</script>

<style scoped lang="scss">
.u-embedded-video {
  .u-embedded-video__content {
    text-align: center;
  }

  &__video:not(:first-child) {
    margin-top: 3.75rem;
  }

  &--left,
  &--right {
    .u-embedded-video__content {
      & > * {
        flex: 1;
      }

      @include media-breakpoint-up($device-min-width-desktop) {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        text-align: initial;

        .u-embedded-video__video {
          margin-top: unset;
        }
      }
    }
  }

  &--left {
    .u-embedded-video__video {
      order: -1
    }
  }
}
</style>
