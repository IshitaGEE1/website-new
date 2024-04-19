<template>
  <base-link class="u-share-button u-share-button--facebook" :url="url" :external="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g fill="none" fill-rule="evenodd">
        <g fill="#1F2732" fill-rule="nonzero">
          <g>
            <path d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm4.2 10.7h-1.5c-1.2 0-1.4.6-1.4 1.4v1.8h2.8l-.4 2.8h-2.4V24h-2.9v-7.3h-2.5v-2.8h2.5v-2.1C14.3 9.3 15.8 8 18 8c1 0 1.9.1 2.2.1v2.6z" transform="translate(-705.000000, -224.000000) translate(705.000000, 224.000000)"/>
          </g>
        </g>
      </g>
    </svg>
  </base-link>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import BaseLink from '../_base/BaseLink';

const SHARE_URL = 'https://www.facebook.com/sharer/sharer.php?u=';

export default {
  name: 'ShareButtonFacebook',
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
