<script>
import ContentfulPageLink from '../_contentful/ContentfulPageLink.vue';

export default {
  name: 'NavigationItem',
  components: { ContentfulPageLink },
  props: {
    url: String,
    logo: Object,
    title: String,
    description: String
  },
  computed: {
    logoSource() {
      return this.logo?.file?.url;
    }
  }
}
</script>

<template>
  <contentful-page-link :url="url" class="u-navigation-item">
    <img :src="logoSource" class="u-navigation-item__logo" width="50" height="50">
    <b class="u-navigation-item__title">{{ title }} ></b>
    <p class="u-navigation-item__description">{{ description }}</p>
  </contentful-page-link>
</template>

<style scoped lang="scss">
.u-navigation-item {
  display: grid;
  grid-template: 50px auto / 50px auto;
  column-gap: 1rem;
  text-decoration: none;

  &:hover {
    --color: var(--pink);
  }

  &__title,
  &__description {
    color: var(--color, var(--blue-darkest));
  }

  &__logo,
  &__title {
    align-self: center;
  }

  &__title {
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.125rem;
    line-height: 1.5rem;
  }

  &__description {
    width: max-content;
    max-width: 250px;
    grid-column-start: 2;
    margin: unset;
    font-family: "Nunito", sans-serif;
    font-size: .9rem;
    line-height: 1.375rem;
  }

  @include navigation-collapse-below {
    &__description {
      display: none;
    }
  }
}
</style>
