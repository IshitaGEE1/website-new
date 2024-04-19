<template>
  <base-page class="u-glossary-page" :content="content" :footer="footer" :header="header">
    <glossary-listing-bar/>

    <section class="u-content-type u-content-type--module u-event">
      <base-headline
        class="u-glossary-page__headline u-glossary-page__headline--centered"
        tag="h1"
        center
        v-if="headline"
      >
        {{ headline }}
      </base-headline>

      <base-headline class="u-glossary-page__headline" tag="h1" v-if="headline">{{ headline }}</base-headline>

      <markdown-text :text="text" v-if="text"/>

      <glossary-category-filter
        class="u-glossary-page__filter-bar"
        :headline="filterBar.label"
        :options="filterBar.options"
        v-if="filterBar"
      />

      <element-glossary-group
        class="u-glossary-page__group"
        :identifier="index"
        :items="group"
        underline
        v-for="(group, index) in glossary"
        :key="`glossary_${index}`"
        v-if="glossary"
      />
    </section>
  </base-page>
</template>

<script>
import FetchPageDataMixin, { fetchPageData } from '../../assets/js/mixins/FetchPageDataMixin';
import BasePage from '../../components/_base/BasePage';
import GlossaryCategoryFilter from '../../components/molecule/GlossaryCategoryFilter';
import GlossaryListingBar from '../../components/organism/GlossaryListingBar';
import MarkdownArea from '../../components/organism/MarkdownArea';
import MarkdownText from '../../components/atom/MarkdownText';
import { createGraphQlClient } from '../../plugins/graphql';
import ContentTypes from '../../assets/js/enums/ContentTypes';

const gqlClient = createGraphQlClient();

export default {
  name: 'GlossaryPage',
  components: { MarkdownText, MarkdownArea, GlossaryListingBar, GlossaryCategoryFilter, BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return {
      ...await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.glossary),
      glossary: await gqlClient.getGlossaryPageReferencesGrouped(ctx.i18n.locale)
    }
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    filterBar() {
      const filterBar = this.fields?.filterBar?.fields;

      if(!filterBar?.options) {
        return null;
      }
      return {
        label: filterBar.label,
        options: filterBar.options
          .filter(i => !i.fields?.label || i.fields?.slug)
          .map(i => ({ label: i.fields.label, value: i.fields.slug }))
      }
    },
    text() {
      return this.fields?.text;
    }
  }
}
</script>

<style scoped lang="scss">
.u-glossary-page {
  &__headline {
    &:not(&--centered) {
      @include mobile {
        display: none;
      }
    }

    &--centered {
      @include tablet-above {
        display: none;
      }
    }
  }

  &__filter-bar {
    margin-top: 3rem;

    @include mobile {
      text-align: center;

      ::v-deep .u-filter-option-cloud {
        justify-content: center;
      }
    }
  }

  &__group {
    margin-top: 3rem;
  }
}
</style>
