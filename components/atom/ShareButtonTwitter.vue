<template>
  <base-link class="u-share-button u-share-button--twitter" :url="url" :external="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g fill="none" fill-rule="evenodd">
        <g fill="#1F2732" fill-rule="nonzero">
          <g>
            <path d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm6.4 12.7v.4c0 4.3-3.3 9.3-9.3 9.3-1.9 0-3.6-.5-5-1.5h.8c1.5 0 3-.5 4.1-1.4-1.4 0-2.6-1-3.1-2.3.2 0 .4.1.6.1.3 0 .6 0 .9-.1-1.5-.3-2.6-1.6-2.6-3.2.4.2.9.4 1.5.4-.9-.6-1.5-1.6-1.5-2.7 0-.6.2-1.2.4-1.7 1.6 2 4 3.3 6.8 3.4-.1-.2-.1-.5-.1-.7 0-1.8 1.5-3.3 3.3-3.3.9 0 1.8.4 2.4 1 .7-.1 1.5-.4 2.1-.8-.2.8-.8 1.4-1.4 1.8.7-.1 1.3-.3 1.9-.5-.6.8-1.2 1.4-1.8 1.8z" transform="translate(-663.000000, -224.000000) translate(663.000000, 224.000000)"/>
          </g>
        </g>
      </g>
    </svg>
  </base-link>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import BaseLink from '../_base/BaseLink';

const SHARE_URL = 'https://twitter.com/intent/tweet?url=';

export default {
  name: 'ShareButtonTwitter',
  components: { BaseLink, BaseImage },
  computed:  {
    url() {
      return SHARE_URL + process.env.HOSTNAME + this.$route.fullPath;
    },
  }
}
</script>

<style scoped lang="scss">
.u-share-button {
  display: block;

  svg {
    display: block;
    width: 2rem;
    height: 2rem;
  }
}
</style>
