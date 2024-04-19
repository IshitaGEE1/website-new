<template>
  <base-page class="u-glossary-category-page" :content="content" :footer="footer" :header="header">
    <module-glossary-listing-bar/>

    <section class="u-content-type u-content-type--module">
      <base-surline v-if="surline">{{ surline }}</base-surline>

      <base-headline class="u-glossary-category-page__headline" tag="h1" v-if="headline">{{ headline }}</base-headline>

      <element-markdown-text class="u-glossary-category-page__text" :text="text" v-if="text"/>

      <element-glossary-group class="u-glossary-category-page__group" :items="glossary" v-if="glossary"/>
    </section>

    <module-blog-posts-teaser v-bind="blogPostsTeaser" v-if="blogPostsTeaser"/>

    <div class="u-content-type u-content-type--module ">
      <glossary-category-filter
        class="u-glossary__filter-bar"
        :headline="filterBar.label"
        :options="filterBar.options"
        v-if="filterBar"
      />
    </div>
  </base-page>
</template>

<script>
import BasePage from '../../../components/_base/BasePage';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import BaseSurline from '../../../components/_base/BaseSurline';
import { createGraphQlClient } from '../../../plugins/graphql';
import ContentfulPageLink from '../../../components/_contentful/ContentfulPageLink';
import GlossaryCategoryFilter from '../../../components/molecule/GlossaryCategoryFilter';
import ContentTypes from '../../../assets/js/enums/ContentTypes';

const gqlClient = createGraphQlClient();

export default {
  name: 'GlossaryCategoryPage',
  components: { GlossaryCategoryFilter, ContentfulPageLink, BaseSurline, BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    const pageData = await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.glossaryCategory);
    const categoryId = pageData?.fields?.category?.sys?.id;

    return {
      ...pageData,
      glossary: await gqlClient.getGlossaryPageReferences(ctx.i18n.locale, categoryId)
    }
  },
  computed: {
    surline() {
      return this.fields?.surline;
    },
    category() {
      return this.fields?.category;
    },
    headline() {
      return this.fields?.category?.fields?.label;
    },
    text() {
      return this.fields?.text;
    },
    blogPostsTeaser() {
      return this.fields?.blogPostsTeaser;
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
  }
}
</script>

<style scoped lang="scss">
.u-glossary-category-page {

  &__text,
  &__category,
  &__group,
  &__filter-bar {
    margin-top: 3rem;
  }
}
</style>
