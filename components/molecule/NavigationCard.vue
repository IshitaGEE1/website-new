<script>
import NavigationItem from '../atom/NavigationItem.vue';
import NavigationLink from '../atom/NavigationLink.vue';
import MarkdownText from '../atom/MarkdownText.vue';

export default {
  name: 'NavigationCard',
  components: { MarkdownText, NavigationLink, NavigationItem },
  props: {
    title: String,
    content: String,
    greyBackground: Boolean
  }
}
</script>

<template>
  <div :class="['u-navigation-card', { 'u-navigation-card--grey' : greyBackground}]">
    <div class="u-navigation-card__title">
      {{ title }}
    </div>

    <markdown-text :text="content"></markdown-text>
  </div>
</template>

<style scoped lang="scss">
.u-navigation-card {
  width: max-content;

  &--grey {
    background-color: var(--light-grey);
  }

  &__title {
    cursor: pointer;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.125rem;
    font-weight: bold;
    color: var(--space-grey);
  }
}
</style>
