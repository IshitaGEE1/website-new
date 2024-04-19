<script>
import InternalLinkService from '../../assets/js/services/internalLink.service';

export default {
  name: 'ChannelTeaser',
  props: {
    slug: String,
    name: String
  },
  computed: {
    _url() {
      return this.slug ? InternalLinkService.processLink(`/channels/${this.slug}`) : undefined;
    }
  }
}
</script>

<template>
  <div class="u-channel-teaser-wrapper">
    <a class="u-channel-teaser cut-off-shape" :href="_url">{{ name }}</a>
  </div>
</template>

<style scoped lang="scss">
.u-channel-teaser {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #fff;
  padding: 2rem 1rem;
  font-family: "Good Headline Pro", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
  color: #000;

  &-wrapper {
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));
  }

  &:not([href]) {
    background: #efefef;
  }
}
</style>
