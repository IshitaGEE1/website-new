<template>
  <aside class="u-article-sidebar">
    <section class="u-article-sidebar__box">
      <base-headline tag="h2">{{ $t('content.latestArticles') }}</base-headline>

      <div class="u-article-sidebar__related-item" v-for="(relatedArticle, index) in relatedArticles" :key="index">
        <span class="u-article-sidebar__related-item-category">
          {{ relatedArticle.category.label }}
        </span>

        <contentful-page-link
          class="u-article-sidebar__related-item-title"
          :url="relatedArticle.url"
          :label="relatedArticle.headline || relatedArticle.url"></contentful-page-link>
      </div>
    </section>

    <section class="u-article-sidebar__box">
      <base-headline tag="h2">{{ $t('content.categories') }}</base-headline>

      <category-switch :related-type="relatedType" @change="onChangeCategorySwitch"/>
    </section>
  </aside>
</template>

<script>
import CategorySwitch from '../atom/CategorySwitch';
import CategoryTypes from '../../assets/js/enums/CategoryTypes';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import BaseHeadline from '../_base/BaseHeadline';
import { createGraphQlClient } from '../../plugins/graphql';

const gqlClient = createGraphQlClient();

export default {
  name: 'ArticleSidebar',
  components: { BaseHeadline, ContentfulPageLink, CategorySwitch },
  props: {
    mainCategory: Object,
    filteredId: String
  },
  data: function () {
    return {
      relatedArticles: []
    }
  },
  computed: {
    relatedType() {
      return CategoryTypes.ARTICLES;
    }
  },
  async fetch() {
    const locale = this.$i18n.locale;
    this.relatedArticles = await gqlClient.getBlogPostTeasers(locale, false, 4)
      .then(r => r.filter(i => i.sys.id !== this.filteredId).splice(0, 3));
  },
  methods: {
    onChangeCategorySwitch(categorySlug) {
      this.$router.push({
        path: InternalLinkService.processLink(this.localePath('/blog')),
        query: {
          category: categorySlug
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.u-article-sidebar {
  &__box {
    padding: 2rem 0;
    background-color: #fff;

    @include tablet-above {
      padding: 2rem;
    }

    & + & {
      margin-top: 2rem;
    }
  }

  &__related-item {
    display: flex;
    text-decoration: none;
    flex-direction: column;
    transition: color 200ms;

    & + & {
      margin-top: 2rem;
    }
  }

  &__related-item-category {
    color: var(--pink);
    font-weight: bold;
    font-size: 0.9375rem;
  }

  &__related-item-title {
    color: var(--space-grey);
    margin-top: 0.25rem;
    font-size: 1.125rem;
  }
}
</style>
