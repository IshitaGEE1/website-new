<template>
  <div class="u-base-video">
    <base-youtube-wrapper
      class="u-base-video__youtube-wrapper"
      :video-id="processedVideoId"
      :video-dimensions="videoDimensions"
      maxres
      inline
      v-if="isYoutube"
    ></base-youtube-wrapper>

    <base-vimeo-wrapper
      class="u-base-video__vimeo-wrapper"
      :video-id="processedVideoId"
      :video-dimensions="videoDimensions"
      maxres
      inline
      v-if="isVimeo"
    ></base-vimeo-wrapper>
  </div>
</template>

<script>
import BaseYoutubeWrapper from './BaseYoutubeWrapper';
import BaseVimeoWrapper from './BaseVimeoWrapper';
import VideoPlatforms from '../../assets/js/enums/VideoPlatforms';
import VideoSettings from '../../assets/js/settings/VideoSettings';

export default {
  name: 'BaseVideo',
  components: { BaseVimeoWrapper, BaseYoutubeWrapper },
  props: {
    url: {
      type: String,
      required: false,
      default: undefined
    },
    videoDimensions: {
      type: Object,
      required: false,
      default() {
        return VideoSettings.DIMENSIONS_850x478
      }
    }
  },
  computed: {
    processedVideoId() {
      if (this.videoId === undefined) {
        return this.getYouTubeVideoIdFromUrl(this.url) || this.getVimeoIdFromUrl(this.url);
      }
      return this.videoId;
    },
    isVimeo() {
      return this.url?.includes(VideoPlatforms.VIMEO);
    },
    isYoutube() {
      return this.url?.includes(VideoPlatforms.YOUTUBE);
    }
  },
  methods: {
    //source: https://blog.devgenius.io/how-to-extract-the-id-of-a-youtube-or-vimeo-url-with-javascript-ad5e2d1049a
    getYouTubeVideoIdFromUrl(url)  {
      // Our regex pattern to look for a youTube ID
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      //Match the url with the regex
      const match = url.match(regExp);
      //Return the result
      return match && match[2].length === 11 ? match[2] : undefined;
    },
    getVimeoIdFromUrl(url)  {
      // Look for a string with 'vimeo', then whatever, then a
      // forward slash and a group of digits.
      const match = /vimeo.*\/(\d+)/i.exec(url);
      // If the match isn't null (i.e. it matched)
      if (match) {
        // The grouped/matched digits from the regex
        return match[1];
      }
    }
  }
}
</script>

<style scoped lang="scss">
.u-base-video {
  max-width: 75rem;
}
</style>
