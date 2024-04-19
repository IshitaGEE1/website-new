<template>
  <div :class="['u-navigation-sub-section', { 'u-navigation-sub-section--grey' : greyBackground}]">
    <div class="u-navigation-sub-section__title">
      <span class="u-navigation-sub-section__label">{{ label }}</span>
    </div>

    <div class="u-navigation-sub-section__elements" :data-columns="columns">
      <template v-for="element in elements">
        <navigation-item
          v-bind="extractNavigationItemFields(element)"
          :key="`nav-subsection-link_${element.sys.id}`"
          v-if="isNavigationItem(element)"
        />

        <navigation-link
          class="u-navigation-sub-section__link"
          v-bind="element"
          :key="`nav-subsection-link_${element.sys.id}`"
          v-else
        />
      </template>
    </div>
  </div>
</template>

<script>
import NavigationLink from '../atom/NavigationLink';
import IconCaret from '../atom/IconCaret';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import NavigationItem from '../atom/NavigationItem.vue';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'NavigationSubSection',
  components: { NavigationItem, IconCaret, NavigationLink },
  mixins: [ContentfulElementMixin],
  computed: {
    label() {
      return this.fields?.label;
    },
    elements() {
      return this.fields?.elements;
    },
    columns() {
      return this.fields?.columns || 1;
    },
    greyBackground() {
      return this.fields?.greyBackground;
    }
  },
  methods: {
    isNavigationItem(item) {
      return item.sys?.contentType?.sys?.id === ContentTypes.elements.navigationItem;
    },
    extractNavigationItemFields(item) {
      return {
        url: `${item?.fields?.linkedTo?.fields?.urlSubfolder}${item?.fields?.linkedTo?.fields?.slug}`,
        title: item?.fields?.linkedTo?.fields?.title,
        logo: item?.fields?.logo?.fields,
        description: item?.fields?.description
      }
    }
  }
}
</script>

<style scoped lang="scss">

.u-navigation-sub-section {

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

    :not(:first-child) {
      margin-left: 0.3125rem;
    }
  }

  @include navigation-collapse-below {
    &__title {
      justify-content: space-between;
    }

    &__elements {
      margin-top: 1.5rem;
    }

    &__elements > * {
      margin-top: 1rem;
    }
  }

  @include navigation-collapse-above {
    &--grey {
      background-color: var(--light-grey);
    }

    &__elements[data-columns] {
      display: grid;
      grid-template-columns: auto;
      gap: 1rem 1rem;
    }

    &__elements:not([data-columns="1"]) {
      grid-template-columns: repeat(2, max-content);
    }

    &__link:first-child {
      margin-top: 1rem;
    }
  }

  @include media-breakpoint-up(1400px) {
    &__elements:not([data-columns="1"]) {
      grid-template-columns: repeat(v-bind(columns), max-content);
    }
  }
}
</style>
