<template>
  <div
    class="u-base-youtube-wrapper"
    :class="{'u-base-youtube-wrapper--inline': inline}"
    :style="`--video-max-width: ${videoDimensions.WIDTH}px`"
  >
    <base-image
      class="u-base-youtube-wrapper__thumbnail" @click="toggleModal"
      :src="thumbnailUrl"
      :width="videoDimensions.WIDTH"
      :height="videoDimensions.HEIGHT"
      lazy
      v-if="!started"
      style="background-color: #CCCCCC"
    ></base-image>

    <div class="u-base-youtube-wrapper__play-wrapper">
      <span class="u-base-youtube-wrapper__play"></span>
    </div>

    <div class="u-base-youtube-wrapper__video-wrapper" v-if="inline && started">
      <iframe
        :src="videoUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen="allowfullscreen"
      ></iframe>
    </div>

    <base-modal-dialog v-if="showModal" @close="toggleModal" v-else>
      <div class="u-base-youtube-wrapper__video-wrapper">
        <iframe
          :src="videoUrl" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen="allowfullscreen"
        ></iframe>
      </div>
    </base-modal-dialog>
  </div>
</template>

<script>
import BaseImage from './BaseImage';
import BaseModalDialog from './BaseModalDialog';
import VideoSettings from '../../assets/js/settings/VideoSettings.js'

export default {
  name: 'BaseYoutubeWrapper',
  components: { BaseModalDialog, BaseImage },
  props: {
    videoId: {
      type: String,
      required: true
    },
    maxres: {
      type: Boolean,
      required: false,
      default: false
    },
    inline: {
      type: Boolean,
      required: false,
      default: false
    },
    videoDimensions: {
      type: Object,
      required: false,
      default() {
        return VideoSettings.DIMENSIONS_850x478
      }
    }
  },
  data() {
    return {
      showModal: false,
      started: false
    }
  },
  computed: {
    thumbnailUrl() {
      return `https://img.youtube.com/vi/${this.videoId}/${this.maxres ? 'maxresdefault' : 'mqdefault'}.jpg`;
    },
    videoUrl() {
      return `https://www.youtube.com/embed/${this.videoId}?autoplay=1`;
    },
  },
  methods: {
    toggleModal() {
      this.started = this.inline && !this.started;
      this.showModal = !this.inline && !this.showModal;
    }
  }
}
</script>

<style scoped lang="scss">
.u-base-youtube-wrapper {
  position: relative;
  cursor: pointer;

  &__thumbnail {
    max-width: var(--video-max-width);
    margin: 0 auto;
  }

  &__play-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(.7);
    pointer-events: none;
  }

  &__play {
    display: inline-block;
    background: rgba(100, 100, 100);
    border-radius: 50% / 10%;
    color: #FFFFFF;
    font-size: 2em; // change this to change size
    height: 2em;
    width: 3em;
    margin: 1.25rem auto;
    padding: 0;
    position: relative;
    text-align: center;
    text-indent: 0.1em;
    transition: all 150ms ease-out;

    &::before {
      content: "";
      position: absolute;
      background: inherit;
      border-radius: 5% / 50%;
      bottom: 9%;
      left: -5%;
      right: -5%;
      top: 9%;
    }

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      left: 52%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-style: solid;
      border-width: .5em 0 .5em .9em;
      border-color: transparent transparent transparent rgba(255, 255, 255, 0.75);
      font-size: 0.75em;
    }
  }

  &:hover {
    .u-base-youtube-wrapper__play {
      background: red;
    }
  }

  &__video-wrapper {
    position: relative;
    max-width: var(--video-max-width);
    margin: 0 auto;

    &::before {
      content: "";
      display: block;
      padding-bottom: calc(9 / 16 * 100%);
      width: 100%;
    }

    iframe {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
