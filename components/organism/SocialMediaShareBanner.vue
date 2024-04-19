<template>
  <section
    :class="['u-content-type u-content-type--module u-social-media-share-banner', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <base-headline tag="h2" center :text="headline" v-if="headline">{{ headline }}</base-headline>

    <base-subline center v-if="subHeadline">{{ subHeadline }}</base-subline>

    <div class="u-social-media-share-banner__body">
      <share-button-bar class="u-social-media-share-banner__button-list"></share-button-bar>
    </div>
  </section>
</template>

<script>
import ContentfulOrganismMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import Platforms from '../../assets/js/enums/Platforms';
import ShareButtonBar from '../molecule/ShareButtonBar';
import BaseHeadline from "../_base/BaseHeadline";
import BaseSubline from "../_base/BaseSubline";

export default {
  name: 'SocialMediaShareBanner',
  components: {BaseSubline, BaseHeadline, ShareButtonBar},
  mixins: [ContentfulOrganismMixin, BackgroundMixin],
  data() {
    return {
      Platforms,
    }
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subHeadline() {
      return this.fields?.subHeadline;
    },
  }
}
</script>

<style scoped lang="scss">
.u-social-media-share-banner {
  &__body {
    text-align: center;
  }

  &__button-list {
    display: flex;
    flex-flow: row;
    justify-content: center;
  }

  &__button {
    & + & {
      margin-left: 1rem;
    }

    ::v-deep img {
      height: 3rem;
    }
  }
}
</style>
