<template>
  <div class="u-footer-section" v-click-outside="() => expanded = false">
    <button class="u-footer-section__toggle" @click="expanded = !expanded">
      <span class="u-footer-section__title">{{ title }}</span>
      <icon-caret class="arrow" :direction="expanded ? 'up' : 'down'"/>
    </button>

    <div class="u-footer-section__elements" v-show="expanded">
      <footer-navigation-item
        class="u-footer-section__element"
        v-for="item in items"
        :key="`footer_nav_item_${item.label}`"
        v-bind="item"
      />
    </div>
  </div>
</template>

<script>
import NavigationLink from '../atom/NavigationLink';
import IconCaret from '../atom/IconCaret';
import FooterNavigationItem from '../atom/FooterNavigationItem.vue';

export default {
  name: 'FooterNavigationSection',
  components: { FooterNavigationItem, IconCaret, NavigationLink },
  props: {
    title: String,
    items: Array
  },
  data() {
    return {
      expanded: false
    }
  }
}
</script>

<style scoped lang="scss">
.u-footer-section {
  &__toggle {
    display: flex;
    align-items: center;
    white-space: nowrap;
    border: none;
    padding: unset;
    background: transparent;
    color: var(--color, var(--blue-darkest));
  }

  &__title {
    font-family: "Nunito", sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    line-height: 2.25rem;
    letter-spacing: 0;
  }

  &__elements {
    display: flex;
    flex-direction: column;
    margin-top: 1.3125rem;
  }

  &__element-wrapper {
    padding-top: 1.25rem;
  }

  @include tablet-below {
    &:hover &__toggle {
      --color: var(--blue);
    }

    &__toggle {
      width: 100%;
      justify-content: space-between;
    }

    &__elements {
      padding-left: 1.375rem;
      animation: sweep .5s ease-in-out;
    }
  }

  @include desktop {
    &__toggle > .arrow {
      display: none;
    }

    &__elements {
      display: block !important;
    }
  }
}
</style>
