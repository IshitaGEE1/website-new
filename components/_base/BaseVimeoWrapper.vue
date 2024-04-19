<template>
  <div
    class="u-base-vimeo-wrapper"
    :class="{'u-base-vimeo-wrapper--inline': inline}"
    :style="`--video-max-width: ${videoDimensions.WIDTH}px`"
  >
    <base-image
      class="u-base-vimeo-wrapper__thumbnail" @click="toggleModal"
      :src="thumbnailUrl"
      :width="videoDimensions.WIDTH"
      :height="videoDimensions.HEIGHT"
      lazy
      v-if="!started && thumbnailUrl"
      style="background-color: #CCCCCC"
    ></base-image>

    <div class="u-base-vimeo-wrapper__play-wrapper">
      <span class="u-base-vimeo-wrapper__play"></span>
    </div>

    <div class="u-base-vimeo-wrapper__video-wrapper" v-if="inline && started">
      <iframe
        :src="videoUrl"
        title="Vimeo video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen="allowfullscreen"
      ></iframe>
    </div>

    <base-modal-dialog v-if="showModal" @close="toggleModal">
      <div class="u-base-vimeo-wrapper__video-wrapper">
        <iframe
          :src="videoUrl" title="Vimeo video player"
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
  name: 'BaseVimeoWrapper',
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
      started: false,
      thumbnailUrl: ''
    }
  },
  computed: {
    videoIdEncoded() {
      return this.videoId;
    },
    videoUrl() {
      return `https://player.vimeo.com/video/${this.videoIdEncoded}?autoplay=1`;
    }
  },
  async fetch() {
    //fetch thumbnail with correct width and height
    await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${this.videoIdEncoded}`)
      .then((response) => response.json())
      .then((response) => this.thumbnailUrl = `${response.thumbnail_url.split('_')[0]}_${this.videoDimensions.WIDTH}x${this.videoDimensions.HEIGHT}`)
      .catch((e) => console.error('Error ocurred when fetching Thumbnail: ', e));
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
.u-base-vimeo-wrapper {
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
    background: rgba(100, 100, 100, 0.8);
    border-radius: 0.3125rem;
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
      border-color: transparent transparent transparent white;
      font-size: 0.75em;
    }
  }

  &:hover {
    .u-base-vimeo-wrapper__play {
      background: rgb(0, 173, 239);
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
