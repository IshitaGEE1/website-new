<script>
import BaseLink from '../_base/BaseLink.vue';
import InternalLinkService from '../../assets/js/services/internalLink.service';

export default {
  components: { BaseLink },
  props: {
    listings: Array
  },
  methods: {
    generateUrl(subfolder, slug) {
      return InternalLinkService.processLink(`${subfolder}${slug}`, this.lang);
    }
  }
}
</script>

<template>
  <div class="u-content-type u-channel-listing-bar">
    <ul class="">
      <li v-for="listing in listings" :key="`channel_listing_${listing.slug}`">
        <base-link
          class="u-channel-listing-bar__link"
          :url="generateUrl(listing.urlSubfolder, listing.slug)"
          :label="listing.title"
          :external="false"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.u-channel-listing-bar {
  background-color: var(--light-grey);
  padding: 0.7rem 0;

  ul {
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    margin-top: unset;
    margin-bottom: unset;
    padding: unset;
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.25rem;
    font-weight: bold;

    @include tablet-above {
      justify-content: center;
      gap: 3.125rem;
    }
  }

  li {
    text-align: center;
  }

  &__link {
    text-decoration: none;

    &:not(:hover) {
      color: var(--text-color);
    }
  }
}
</style>
