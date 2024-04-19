<template>
  <div class="u-collapsable">
    <base-cta
      tertiary
      :class="['u-collapsable__button', { 'u-collapsable__button--collapsed': collapsed }]"
      @click="toggleCollapsed"
      v-if="!expanded"
    >
      {{ collapsed ? $t('controls.showLess') : $t('controls.showMore') }}
    </base-cta>

    <div class="u-collapsable__body" v-show="collapsed || expanded">
      <base-headline tag="h3" class="u-collapsable__headline">{{ headline }}</base-headline>

      <span class="u-headline2__sub-title u-collapsable__subHeadline">{{ subHeadline }}</span>

      <ul class="u-collapsable__element-list">
        <li v-for="element in elements" class="u-collapsable__element">
          <component :is="element.sys.contentType.sys.id" v-bind="element" :key="element.sys.id"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BaseHeadline from "../_base/BaseHeadline";
import BaseCta from '../_base/BaseCta';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
export default {
  name: 'Collapsable',
  components: { BaseCta, BaseHeadline},
  mixins: [ContentfulElementMixin],
  data() {
    return {
      collapsed: false
    }
  },
  computed: {
    expanded() {
      return this.fields?.expanded || false;
    },
    headline() {
      return this.fields?.headline;
    },
    subHeadline() {
      return this.fields?.subHeadline;
    },
    elements() {
      return this.fields?.elements;
    }
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>

<style scoped lang="scss">
.u-collapsable {
  text-align: center;

  &__button {
    margin-top: 1.25rem;
  }

  &__body {
  }

  &__headline {
    margin-top: 1.25rem;
  }

  &__element-list {
    display: flex;
    flex-flow: column nowrap;
    margin-top: 1.25rem;
    justify-content: center;
    gap: $gutter-size;
    list-style: none;
    padding: unset;

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row wrap;

      > * {
        width: calc(100% / 2 - #{$gutter-size});
      }
    }

    @include media-breakpoint-up($device-min-width-desktop) {
      > * {
        width: calc(100% / 3 - #{$gutter-size});
      }
    }
  }
}
</style>
