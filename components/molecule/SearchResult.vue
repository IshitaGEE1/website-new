<template>
  <div class="u-search-result" >
    <div class="u-search-result__url">{{ url }}</div>

    <contentful-page-link :url="url" v-if="internal">
      <base-headline tag="h3" class="u-search-result__title">
        {{ title }}
      </base-headline>
    </contentful-page-link>

    <base-link :url="url" :external="true" v-else>
      <base-headline tag="h3" class="u-search-result__title">
        {{ title }}
      </base-headline>
    </base-link>

    <div class="u-search-result__description">{{ description }}</div>
  </div>
</template>

<script>
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import BaseLink from '../_base/BaseLink';
import BaseHeadline from "../_base/BaseHeadline";
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'SearchResult',
  components: {BaseHeadline, BaseLink, ContentfulPageLink },
  props: {
    url: String,
    title: String,
    description: String,
    internal: Boolean
  }
}
</script>

<style scoped lang="scss">
.u-search-result {
  &__url {
    color: var(--pink);
  }

  &__title {
    margin: 0.625rem 0;
    color: var(--space-grey);
  }

  &__description {
    color: #6b7c8c;
  }
}
</style>
