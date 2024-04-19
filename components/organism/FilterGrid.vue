<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-filter-grid', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div class="u-filter-grid__head">
      <base-headline tag="h2" class="u-filter-grid__headline" :text="headline" v-if="headline">
        {{ headline }}
      </base-headline>

      <base-subline class="u-filter-grid__subline" v-if="subheadline">{{ subheadline }}</base-subline>

      <p class="u-filter-grid__text" v-if="text">{{ text }}</p>
    </div>

    <div class="u-filter-grid__body">
      <div>
        <filter-option-cloud
          class="u-filter-grid__filter-options"
          :options="filterOptions"
          center
          @change="onFilterChange"
        />
      </div>

      <ul class="u-filter-grid__element-list" :columns="columns" v-if="filteredElements">
        <li
          v-for="(element, index) in filteredElements"
          :key="`element_${element.sys.id}_${index}`"
        >
          <article-teaser-card v-bind="element" class="u-filter-grid__element" v-if="isArticle(element)"/>
          <customer-teaser-card v-bind="element" class="u-filter-grid__element" v-else-if="isCustomer(element)"/>
          <partner-teaser-card v-bind="element" class="u-filter-grid__element" v-else-if="isPartner(element)"/>
          <event-teaser-card v-bind="element" class="u-filter-grid__element" v-else-if="isEvent(element)"/>
          <company-news-teaser-card v-bind="element" class="u-filter-grid__element" v-else-if="isCompanyNews(element)"/>

          <base-error v-else>
            Card cannot be displayed due to unknown object reference.
          </base-error>
        </li>
      </ul>
    </div>

    <div class="u-filter-grid__actions">
      <base-cta
        class="u-filter-grid__button-visibility-trigger"
        @click="showAllElements = !showAllElements"
        v-if="showExpandButton"
      >
        {{ showAllElements ? $t('controls.hide') : $t('controls.showAll') }}
      </base-cta>

      <component :is="actionType" v-bind="action" class="u-filter-grid__action"/>
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
import FilterOptionCloud from '../molecule/FilterOptionsCloud';
import AutomaticFillMixin from '../../assets/js/mixins/AutomaticFillMixin';
import CompanyNewsTeaserCard from '../molecule/CompanyNewsTeaserCard';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSubline from '../_base/BaseSubline';
import BaseCta from '../_base/BaseCta';

const DEFAULT_COLUMN_COUNT = 2;
const DEFAULT_INITIAL_ITEM_COUNT = 0;

export default {
  name: 'FilterGrid',
  components: {
    BaseCta,
    BaseSubline,
    BaseHeadline,
    CompanyNewsTeaserCard,
    CompanyEventCard,
    BaseError,
    CustomerTeaserCard,
    PartnerTeaserCard,
    Card,
    EventTeaserCard,
    ArticleTeaserCard,
    FilterOptionCloud
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
      const options = this.fields?.filterOptions;

      return [{
        label: this.$t('controls.all'),
        value: undefined
      }, ...options?.map(i => {
        return {
          label: i.fields?.label,
          value: i.fields?.slug
        }
      }).filter(i => i.label && i.value)];
    },
    filteredElements() {
      let elements = this.elements;
      const filter = this.activeFilterOption?.value;

      if (filter) {
        elements = this.elements.filter(element =>
          (element?.category?.slug || element?.fields?.categories[0]?.fields?.slug) === filter);
      }
      return elements.filter((element, index) => this.showAllElements || index < this.initialDisplayedItems);
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
      if (this.initialDisplayedItems === 0) {
        return false;
      }
      return this.elements.length > this.initialDisplayedItems;
    }
  },
  methods: {
    getPageType(element) {
      return element?.typeName;
    },
    getCategoryAndTagSlugs(element) {
      const slugs = [
        `c__${element?.fields?.category?.fields?.slug}`,
        ...element?.fields?.tags?.map(t => `t__${t?.fields?.slug}`) || [],
        `c__${element?.category?.slug}`,
        ...element?.tags?.map(t => `t__${t?.slug}`) || []
      ];
      return slugs;
    },
    isPartner(element) {
      return this.getPageType(element).toLowerCase() === ContentTypes.pages.partner.toLowerCase();
    },
    isCustomer(element) {
      return this.getPageType(element).toLowerCase() === ContentTypes.pages.customer.toLowerCase();
    },
    isEvent(element) {
      return this.getPageType(element).toLowerCase() === ContentTypes.pages.event.toLowerCase();
    },
    isArticle(element) {
      return this.getPageType(element).toLowerCase() === ContentTypes.pages.article.toLowerCase();
    },
    isCompanyNews(element) {
      return this.getPageType(element).toLowerCase() === ContentTypes.pages.companyNews.toLowerCase();
    },
    onFilterChange(activeFilterOption) {
      this.activeFilterOption = activeFilterOption;
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/main";

.u-filter-grid {
  @include media-breakpoint-up($device-min-width-desktop) {
    &__head {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
    }

    &__headline,
    &__subline {
      grid-column-end: span 5;
    }

    &__head:not(:has(> .u-filter-grid__text)) > .u-filter-grid__headline,
    &__head:not(:has(> .u-filter-grid__text)) > .u-filter-grid__subline {
      grid-column-end: span 7;
    }

    &__text {
      grid-column-end: span 7;
      grid-row-end: span 2;
      margin-top: 2.375rem;
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

    >:has(> .cut-off-shape) {
      filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    }
  }

  &__element {
    height: 100%;
  }

  &__actions {
    text-align: center;
  }

  &__action {
    margin-top: 3.125rem;
  }

  &__button-visibility-trigger {
    margin-top: 2rem;
  }

  &__filter-options {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
}
</style>
