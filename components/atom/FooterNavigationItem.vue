<script>
import ContentfulPageLink from '../_contentful/ContentfulPageLink.vue';
import BaseLink from '../_base/BaseLink.vue';

export default {
  name: 'FooterNavigationItem',
  components: { BaseLink, ContentfulPageLink },
  props: {
    url: String,
    label: String,
    external: Boolean
  }
}
</script>

<template>
  <base-link
    class="u-footer-navigation-item"
    :url="url"
    :external="true"
    v-if="external"
  >
    {{ label }}
  </base-link>

  <contentful-page-link
    class="u-footer-navigation-item"
    :url="url"
    v-else
  >
    {{ label }}
  </contentful-page-link>
</template>

<style scoped lang="scss">
.u-footer-navigation-item {
  display: block;
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
  color: var(--blue-darkest);
  font-family: "Nunito", sans-serif;
  font-size: 1.0625rem;
  line-height: 1.25rem;
  text-decoration: none;
}
</style>
