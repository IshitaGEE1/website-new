<template>
  <base-page :content="content" :footer="footer" :header="header">
    <module-glossary-listing-bar/>

    <section class="u-content-type u-content-type--module u-event">
      <base-headline class="u-glossary__headline" tag="h1" v-if="headline">{{ headline }}</base-headline>

      <element-markdown-text class="u-glossary__text" :text="definition" v-if="definition"/>

      <div class="u-glossary__category" v-if="assignedCategory">
        Category:
        <base-link
          :url="this.localePath({path: `/glossary/category/${assignedCategory.slug}/`}, lang)"
          :label="assignedCategory.label"
          :external="false"
        />
      </div>

      <div class="u-glossary__related-terms" v-if="relatedTerms">
        <element-glossary-group
          class="u-glossary__terms"
          identifier="Related terms"
          :items="relatedTerms"
        />
      </div>

      <glossary-category-filter
        class="u-glossary__filter-bar"
        :headline="filterBar.label"
        :options="filterBar.options"
        v-if="filterBar"
      />
    </section>
  </base-page>
</template>

<script>
import BasePage from '../../../components/_base/BasePage';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import BaseLink from '../../../components/_base/BaseLink';
import GlossaryCategoryFilter from '../../../components/molecule/GlossaryCategoryFilter';
import ContentTypes from '../../../assets/js/enums/ContentTypes';

export default {
  name: 'GlossaryTermPage',
  components: { GlossaryCategoryFilter, BaseLink, BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.glossaryTerm);
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    definition() {
      return this.fields?.definition;
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
    assignedCategory() {
      return this.fields?.assignedCategory?.fields;
    },
    relatedTerms() {
      if(!this.fields?.relatedTerms) {
        return [];
      }
      return this.fields?.relatedTerms
        .filter(i => !i.fields?.urlSubfolder || i.fields?.slug)
        .map(i => ({
        headline: i.fields?.title,
        url: i.fields.urlSubfolder + i.fields.slug
      }))
    }
  }
}
</script>

<style scoped lang="scss">
.u-glossary {

  &__text,
  &__category,
  &__related-terms,
  &__filter-bar {
    margin-top: 3rem;
  }
}
</style>
