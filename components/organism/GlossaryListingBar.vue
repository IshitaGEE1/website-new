<template>
  <div class="u-content-type u-glossary-listing-bar">
    <ul class="">
      <li>
        <base-link :url="generateUrl()" class="u-glossary-listing-bar__link" label="ALL" :external="false"/>
      </li>

      <li v-for="(item, index) in items" :key="`glossary_listing_group_${index}`">
        <base-link :url="generateUrl(item.url)" class="u-glossary-listing-bar__link" :label="item.label" :external="false"/>
      </li>
    </ul>
  </div>
</template>

<script>
import InternalLinkService from '../../assets/js/services/internalLink.service';
import { createGraphQlClient } from '../../plugins/graphql';

const gqlClient = createGraphQlClient();

export default {
  name: 'GlossaryListingBar',
  data() {
    return {
      items: []
    }
  },
  async fetch() {
    await gqlClient.getGlossaryListingGroups(this.$i18n.locale).then(r => this.items = r);
  },
  methods: {
    generateUrl(listing) {
      if (!listing) {
        return InternalLinkService.processLink('/glossary/', this.lang);
      }
      return InternalLinkService.processLink(this.localePath({ path: listing }, this.lang));
    }
  }
}
</script>

<style scoped lang="scss">
.u-glossary-listing-bar {
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

  &__link {
    text-decoration: none;

    &:not(:hover) {
      color: var(--text-color);
    }
  }
}
</style>
