<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-content-grid', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div class="u-content-grid__head">
      <base-headline tag="h2" class="u-content-grid__headline" :text="headline" v-if="headline">
        {{ headline }}
      </base-headline>

      <base-subline class="u-content-grid__subline" v-if="subheadline">{{ subheadline }}</base-subline>

      <p class="u-content-grid__text" v-if="text">{{ text }}</p>
    </div>

    <div class="u-content-grid__body" v-if="elements">
      <ul class="u-content-grid__element-list" :columns="columns">
        <li
          class="u-content-grid__element"
          :class="{ 'u-content-grid__element--hidden': isHidden(index) }"
          v-for="(element, index) in elements"
          :key="`element_${element.id}_${index}`"
        >
          <card v-bind="element" class="u-content-grid__card" v-if="isCard(element)"/>
          <company-event-card v-bind="element" class="u-content-grid__card" v-else-if="isCompanyEvent(element)"/>
          <partner-teaser-card v-bind="element" class="u-content-grid__card" v-else-if="isPartner(element)"/>
          <event-teaser-card v-bind="element" class="u-content-grid__card" v-else-if="isEvent(element)"/>
          <customer-teaser-card v-bind="element" class="u-content-grid__card" v-else-if="isCustomer(element)"/>
          <article-teaser-card v-bind="element" class="u-content-grid__card" v-else-if="isArticle(element)"/>
          <company-news-teaser-card v-bind="element" class="u-content-grid__card" v-else-if="isCompanyNews(element)"/>
          <bio-card v-bind="element" class="u-content-grid__card" v-else-if="isBioCard(element)"/>

          <base-error v-else>
            Card cannot be displayed due to unknown object reference.
          </base-error>
        </li>
      </ul>
    </div>

    <div class="u-content-grid__actions">
      <base-cta
        class="u-content-grid__button-visibility-trigger"
        @click="showAllElements = !showAllElements"
        v-if="showExpandButton"
      >
        {{ showAllElements ? $t('controls.hide') : $t('controls.showAll') }}
      </base-cta>

      <component :is="actionType" v-bind="action" class="u-content-grid__action"/>
    </div>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import Card from '../molecule/Card';
import PartnerTeaserCard from '../molecule/PartnerTeaserCard';
import CustomerTeaserCard from '../molecule/CustomerTeaserCard';
import EventTeaserCard from '../molecule/EventTeaserCard';
import BaseError from '../_base/BaseError';
import ArticleTeaserCard from '../molecule/ArticleTeaserCard.vue';
import CompanyEventCard from '../molecule/CompanyEventCard';
import AutomaticFillMixin from '../../assets/js/mixins/AutomaticFillMixin';
import CompanyNewsTeaserCard from '../molecule/CompanyNewsTeaserCard';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import BioCard from '../molecule/BioCard';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSubline from '../_base/BaseSubline';
import BaseCta from '../_base/BaseCta';

const DEFAULT_COLUMN_COUNT = 2;
const DEFAULT_INITIAL_ITEM_COUNT = 0;

export default {
  name: 'ContentGrid',
  components: {
    BaseCta,
    BaseSubline,
    BaseHeadline,
    BioCard,
    CompanyNewsTeaserCard,
    CompanyEventCard,
    BaseError,
    CustomerTeaserCard,
    PartnerTeaserCard,
    Card,
    EventTeaserCard,
    ArticleTeaserCard
  },
  mixins: [ContentfulModuleMixin, BackgroundMixin, AutomaticFillMixin, DynamicKeywordObserver],
  data() {
    return {
      activeFilterOption: undefined,
      showAllElements: false
    }
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subheadline() {
      return this.fields?.subheadline;
    },
    text() {
      return this.fields?.text;
    },
    filterOptions() {
      return this.fields?.filterOptions;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    },
    columns() {
      return this.fields?.columns || DEFAULT_COLUMN_COUNT;
    },
    initialDisplayedItems() {
      let itemCount = this.fields?.initialDisplayedItems || DEFAULT_INITIAL_ITEM_COUNT;
      if (itemCount === DEFAULT_INITIAL_ITEM_COUNT) {
        this.showAllElements = true;
      }
      return itemCount;
    },
    showExpandButton() {
      if (this.initialDisplayedItems === DEFAULT_INITIAL_ITEM_COUNT) {
        return false;
      }
      return this.elements.length > this.initialDisplayedItems;
    }
  },
  methods: {
    isCard(element) {
      return element?.typeName === 'elementCard';
    },
    isCompanyEvent(element) {
      return element?.typeName === 'moduleCompanyEvent';
    },
    isPartner(element) {
      return element?.typeName === ContentTypes.pages.partner;
    },
    isCustomer(element) {
      return element?.typeName === ContentTypes.pages.customer;
    },
    isEvent(element) {
      return element?.typeName === ContentTypes.pages.event;
    },
    isArticle(element) {
      return element?.typeName === ContentTypes.pages.article;
    },
    isCompanyNews(element) {
      return element?.typeName === ContentTypes.pages.companyNews;
    },
    isBioCard(element) {
      return element?.typeName === 'elementBioCard';
    },
    isHidden(elementIndex) {
      if (this.initialDisplayedItems === 0 || this.showAllElements) {
        return false;
      }
      return elementIndex >= this.initialDisplayedItems;
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/main";

.u-content-grid {
  &__subline {
    margin-top: 2rem;
  }

  @include media-breakpoint-up($device-min-width-desktop) {
    &__head {
      display: grid;
      column-gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
    }

    &__headline,
    &__subline {
      grid-column-end: span 5;
    }

    &__head:not(:has(> .u-content-grid__text)) > .u-content-grid__headline,
    &__head:not(:has(> .u-content-grid__text)) > .u-content-grid__subline {
      grid-column-end: span 7;
    }

    &__text {
      grid-column-start: 7;
      grid-column-end: span 6;
      grid-row-end: span 2;
      margin-top: 2.375rem;
      order: -1;
    }
  }

  &__body {
    position: relative;
    z-index: 1;
  }

  &__element-list {
    --spacing-width-x: 80px;
    --spacing-width-y: 64px;

    display: flex;
    margin-top: 2.5rem;
    flex-flow: column nowrap;
    gap: var(--spacing-width-y) var(--spacing-width-x);
    list-style: none;
    padding: unset;

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row wrap;
      justify-content: center;
      align-items: stretch;
      margin-left: calc(var(--spacing-width-x) / -2);
      margin-right: calc(var(--spacing-width-x) / -2);
    }

    > * {
      @include media-breakpoint-up($device-min-width-tablet) {
        width: calc(100% / 2 - var(--spacing-width-x));
      }
    }

    @for $i from 3 through 4 {
      &[columns="#{$i}"] > * {
        @include media-breakpoint-up($device-min-width-desktop) {
          width: calc(100% / #{$i} - var(--spacing-width-x));
        }
      }
    }

    > :has(> .cut-off-shape) {
      filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    }
  }

  &__card {
    height: 100%;
  }

  &__actions {
    text-align: center;
  }

  &__action {
    margin-top: 3.125rem;
  }

  &__element {
    &--hidden {
      display: none;
    }
  }

  &__button-visibility-trigger {
    margin-top: 2rem;
  }
}
</style>
