<template>
  <div :class="['u-company-event-card', 'cut-off-shape']">
    <base-youtube-wrapper :video-id="id" v-if="isYoutube"></base-youtube-wrapper>
    <base-vimeo-wrapper :video-id="id" v-else></base-vimeo-wrapper>

    <base-headline tag="h3" class="u-company-event-card__headline">{{ headline }}</base-headline>
  </div>
</template>

<script>
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import BaseModalDialog from '../_base/BaseModalDialog';
import BaseImage from '../_base/BaseImage';
import BaseYoutubeWrapper from '../_base/BaseYoutubeWrapper';
import BaseVimeoWrapper from '../_base/BaseVimeoWrapper.vue';
import BaseHeadline from "../_base/BaseHeadline";

export default {
  name: 'CompanyEventCard',
  components: {BaseHeadline, BaseYoutubeWrapper, BaseImage, BaseModalDialog, BaseVimeoWrapper },
  mixins: [ContentfulElementMixin],
  computed: {
    id() {
      return this.fields?.videoId;
    },
    isYoutube() {
      return this.fields?.platform !== "vimeo";
    },
    headline() {
      return this.fields?.headline;
    }
  },
}
</script>

<style scoped lang="scss">
.u-company-event-card {
  @extend %teaserCard;
  @include set-box-shadow;
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  height: 100%;
}
</style>
