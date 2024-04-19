<template>
  <header :class="['u-header', {'u-header--index': isIndex, 'u-header--scrolled': scrolled}]">
    <nav class="u-header__nav">
      <contentful-page-link url="/" class="u-header__brand">
        <img
          :src="companyLogo?.url"
          :alt="companyLogo?.description"
          :title="companyLogo?.title"
          width="153"
          height="38">
      </contentful-page-link>

      <div class="u-header__top-menu" v-if="mainMenuItems.length > 0">
        <login-button
          class="u-header__login"
          :url="loginUrl"
          v-if="loginUrl"
          v-show="!searchExpanded"
        ></login-button>

        <search-field class="u-header__search" @toggle="searchExpanded = $event"></search-field>

        <language-switch class="u-header__lang-switch" v-show="!searchExpanded"></language-switch>

        <component
          :is="actionType"
          v-bind="mainMenuAction"
          class="u-header__action"
          small
          v-if="actionType && mainMenuAction"
        />
      </div>

      <navigation-menu
        class="u-header__main-menu"
        :items="mainMenuItems"
        :action="mainMenuAction"
        v-if="mainMenuItems.length > 0"
      ></navigation-menu>
    </nav>
  </header>
</template>

<script>
import NavigationMenu from '../molecule/NavigationMenu';
import LanguageSwitch from '../atom/LanguageSwitch';
import BaseImage from '../_base/BaseImage';
import ContentfulImage from '../_contentful/ContentfulImage';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import PageScrollMixin from '../../assets/js/mixins/PageScrollMixin';
import LoginButton from '../atom/LoginButton.vue';
import SearchField from '../atom/SearchField.vue';
import BurgerButton from '../atom/BurgerButton.vue';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';

export default {
  name: 'PageHeader',
  components: {
    BurgerButton,
    SearchField,
    LoginButton,
    ContentfulPageLink,
    ContentfulImage,
    BaseImage,
    LanguageSwitch,
    NavigationMenu
  },
  mixins: [ContentfulModuleMixin, PageScrollMixin],
  inject: {
    showBreadcrumb: {
      from: 'showBreadcrumb',
      default: false
    }
  },
  props: {
    contentType: String
  },
  data() {
    return {
      menuExpanded: false,
      searchExpanded: false
    }
  },
  computed: {
    companyLogo() {
      const logo = { ...this.fields?.logo?.fields };
      logo['url'] = logo?.file?.url;
      delete logo.file;
      return logo;
    },
    loginUrl() {
      return this.fields?.loginLink?.fields?.url || '#';
    },
    mainMenuItems() {
      return this.fields?.navigation || [];
    },
    mainMenuAction() {
      return this.fields?.action;
    },
    actionType() {
      return this.mainMenuAction?.sys?.contentType?.sys?.id;
    }
  },
  methods: {
    toggleNavigation() {
      this.menuExpanded = !this.menuExpanded;
      document.body.classList.toggle('u-force-overflow-hidden');
    }
  }
}
</script>

<style scoped lang="scss">
.u-header {
  --hover-color: var(--blue);

  transition: background .2s ease-out;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--height-header);
  display: flex;
  align-items: center;

  &--scrolled {
    background: #fff;
  }

  &--index:not(.u-header--scrolled) {
    --hover-color: #fff;

    background-color: var(--blue);
  }

  &__top-menu {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-menu-items);
  }

  &__action {
    display: none;
  }

  @include navigation-collapse-below {
    &__nav {
      @include set-module-width;
      display: grid;
      grid-template-columns: auto repeat(4, min-content);
      align-items: center;
      justify-items: flex-end;
      gap: 1.5rem;
    }

    &__brand {
      justify-self: flex-start;
    }

    &__top-menu,
    &__main-menu {
      --gap-menu-items: 1rem;
    }

    &__top-menu {
      display: contents;
    }

    &__main-menu {
      display: contents;
    }
  }

  @include navigation-collapse-above {
    &__nav {
      @include set-module-width;
      display: grid;
      column-gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
      grid-auto-flow: row;
      grid-auto-rows: auto;
      align-items: flex-end;
      row-gap: 1rem;
    }

    &__brand {
      grid-column-end: span 2;
      grid-row-end: span 2;
      align-items: flex-end;
      line-height: 1;
    }

    &__top-menu,
    &__main-menu {
      --gap-menu-items: 1.8rem;

      grid-column-end: span 10;
      justify-self: flex-end;
    }
  }

  @include media-breakpoint-between($navigation-collapse-breakpoint, 1200px) {
    &__brand {
      line-height: 0;
    }

    &__action {
      display: initial;
    }
  }
}
</style>
