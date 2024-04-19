<template>
  <div
    class="u-navigation-main-section"
    v-click-outside="closePopup"
  >
    <button
      class="u-navigation-main-section__title"
      @click="togglePopup"
    >
      <span class="u-navigation-main-section__label">{{ label }}</span>
      <icon-caret :direction="expanded ? 'up' : 'down'"/>
    </button>

    <div class="u-navigation-main-section__popup" @mouseleave="closePopup">
      <div class="u-navigation-main-section__elements" v-show="expanded">
        <template v-for="(element, index) in elements">
          <navigation-card
            class="u-navigation-main-section__card"
            :key="`main_nav_element_${index}`"
            v-bind="element.fields"
            v-if="isNavigationCard(element)"
          />

          <navigation-sub-section
            class="u-navigation-main-section__section"
            :key="`main_nav_element_${index}`"
            v-bind="element"
            v-else
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import NavigationSubSection from './NavigationSubSection';
import IconCaret from '../atom/IconCaret';
import NavigationCard from './NavigationCard.vue';
import ContentTypes from '../../assets/js/enums/ContentTypes';

export default {
  name: 'NavigationMainSection',
  components: { NavigationCard, IconCaret, NavigationSubSection },
  mixins: [ContentfulElementMixin],
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    label() {
      return this.fields?.label;
    },
    elements() {
      return this.fields?.elements
    },
    onDesktop() {
      return document?.documentElement?.clientWidth < 1200;
    }
  },
  methods: {
    closePopup() {
      this.expanded = false;
    },
    togglePopup() {
      this.expanded = !this.expanded;
    },
    isNavigationCard(element) {
      return element?.sys?.contentType?.sys?.id === ContentTypes.elements.navigationCard;
    }
  }
}
</script>

<style scoped lang="scss">
.u-navigation-main-section {
  position: relative;

  &__title {
    cursor: pointer;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--space-grey);
    border: none;
    padding: unset;
    background: transparent;

    :not(:first-child) {
      margin-left: 0.3125rem;
    }
  }

  &:hover &__title {
    color: var(--blue);
  }

  @include navigation-collapse-below {
    &__title {
      justify-content: space-between;
      width: 100%;
    }

    &__card {
      display: none;
    }

    &__section {
      margin-top: 2rem;
      margin-left: 2rem;
      animation: sweep .5s ease-in-out;
    }
  }

  @include navigation-collapse-above {
    &__popup {
      position: fixed;
      top: var(--height-header);
      left: 50%;
      transform: translateX(-50%);
      filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    }

    &__elements {
      display: flex;
      background: #FFF;
      clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px);
    }

    &__card,
    &__section {
      --outer-spacing: 3rem;
      --inner-spacing: 2rem;

      padding-top: var(--outer-spacing);
      padding-bottom: var(--outer-spacing);

      &:first-child {
        padding-left: var(--outer-spacing);
      }

      &:not(:first-child) {
        position: relative;
        padding-left: var(--inner-spacing);

        &::before {
          position: absolute;
          content: "";
          height: calc(100% - (2 * var(--outer-spacing)));
          border-left: 1px solid #efefef;
          left: 0;
        }
      }

      &:not(:last-child) {
        padding-right: var(--inner-spacing);
      }

      &:last-child {
        padding-right: var(--outer-spacing);
      }
    }
  }

  @include media-breakpoint-up(1300px) {
    &__popup {
      position: absolute;
      top: calc(100% + 1.25rem);
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
