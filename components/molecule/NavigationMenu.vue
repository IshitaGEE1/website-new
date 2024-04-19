<template>
  <div class="u-navigation-menu">
    <div class="u-navigation-menu__menu" v-show="!menuCollapsed">
      <div class="u-navigation-menu__menu-item" v-for="(item, index) in items">
        <navigation-link v-bind="item" main v-if="isLink(item)"/>

        <navigation-main-section
          v-bind="item"
          :inline="!menuCollapsed"
          :key="`nav_section_${index}`"
          v-else
        />
      </div>

      <component
        :is="actionType"
        v-bind="action"
        class="u-navigation-menu__action"
        small
        v-if="actionType && action"
      />
    </div>

    <burger-button class="u-navigation-menu__toggle" @change="toggleNavigation"/>
  </div>
</template>

<script>
import LanguageSwitch from '../atom/LanguageSwitch.vue';
import SearchField from '../atom/SearchField.vue';
import BaseImage from '../_base/BaseImage';
import LoginButton from '../atom/LoginButton';
import BurgerButton from '../atom/BurgerButton';
import PageScrollMixin from '../../assets/js/mixins/PageScrollMixin';
import NavigationMainSection from './NavigationMainSection';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import NavigationLink from '../atom/NavigationLink';

export default {
  name: 'NavigationMenu',
  components: {
    NavigationLink,
    NavigationMainSection,
    BurgerButton,
    LoginButton,
    BaseImage,
    LanguageSwitch,
    SearchField
  },
  mixins: [PageScrollMixin],
  props: {
    items: Array,
    action: Object
  },
  data() {
    return {
      menuCollapsed: true,
    }
  },
  computed: {
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    }
  },
  destroyed() {
    document.body.classList.remove('u-force-overflow-hidden');
  },
  methods: {
    toggleNavigation() {
      this.menuCollapsed = !this.menuCollapsed;
      document.body.classList.toggle('u-force-overflow-hidden');
    },
    isLink(item) {
      return [...Object.values(ContentTypes.pages), ContentTypes.elements.link].includes(item?.sys?.contentType?.sys?.id);
    }
  }
}
</script>

<style scoped lang="scss">
.u-navigation-menu {
  &__action {
    width: min-content;
    white-space: nowrap;

    &:hover {
      text-decoration: none;
    }
  }

  @include navigation-collapse-below {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.125rem;
    line-height: 1.1em;

    &__menu {
      position: fixed;
      left: 0;
      right: 0;
      top: var(--height-header);
      bottom: 0;
      padding-left: 2rem;
      padding-right: 2rem;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - var(--height-header));
      overflow-y: scroll;
      background: #fff;
    }

    &__menu-item {
      padding-top: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #D2D5DA;
    }

    &__action {
      order: -1;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  @include navigation-collapse-above {
    &__menu {
      display: flex !important;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-menu-items, 1rem);
    }

    &__toggle {
      display: none;
    }
  }

  @include media-breakpoint-between($navigation-collapse-breakpoint, 1200px) {
    &__action {
      display: none;
    }
  }
}
</style>
