<template>
  <ul :class="['u-action-bar', theme]"
      v-bind="backgroundAttributes"
      :style="backgroundStyles"
  >
    <li
      :data-mobile-item="item.mobile"
      v-for="(item, index) in combinedItems"
      :key="`actionBarItem_${index}`"
    >
      <navigation-link class="u-action-bar__item" v-bind="item" area="actionBar" v-if="isLinkItem(item) || isPageItem(item)">
        {{ getLabel(item) }}
      </navigation-link>

      <base-link class="u-action-bar__item" :external="false" v-else>
        {{ getLabel(item) }}
      </base-link>
    </li>
  </ul>
</template>

<script>
import ContentTypes from '../../assets/js/enums/ContentTypes';
import NavigationButton from '../atom/NavigationButton';
import BaseCta from '../_base/BaseCta';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BaseLink from '../_base/BaseLink.vue';
import NavigationLink from '../atom/NavigationLink.vue';

export default {
  name: 'ActionBar',
  mixins: [ContentfulModuleMixin, BackgroundMixin],
  components: { NavigationLink, BaseLink, BaseCta, NavigationButton },
  computed: {
    items() {
      return this.fields?.items;
    },
    mobileItems() {
      return this.fields?.mobileItems;
    },
    combinedItems() {
      return [...this.items.map(i => ({ mobile: false, ...i })), ...this.mobileItems.map(i => ({ mobile: true, ...i }))];
    }
  },
  methods: {
    isLabelItem(item) {
      return item?.sys?.contentType?.sys?.id === ContentTypes.elements.label;
    },
    isLinkItem(item) {
      return item?.sys?.contentType?.sys?.id === ContentTypes.elements.link;
    },
    isPageItem(item) {
      return Object.values(ContentTypes.pages).includes(item?.sys?.contentType?.sys?.id);
    },
    getLabel(item) {
      const contentType = item?.sys?.contentType?.sys?.id;

      switch (contentType) {
        case ContentTypes.elements.label:
          return item?.fields?.text;
        case ContentTypes.elements.link:
        default:
          return item?.fields?.label || item?.fields?.title;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.u-action-bar {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto;
  grid-auto-flow: column;
  grid-column-gap: 3.125rem;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: unset;
  padding: unset;

  li {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    &[data-mobile-item] {
      @include tablet {
        display: none;
      }

      @include desktop {
        display: none;
      }
    }

    &:not([data-mobile-item]) {
      @include mobile {
        display: none;
      }
    }
  }
}
</style>
