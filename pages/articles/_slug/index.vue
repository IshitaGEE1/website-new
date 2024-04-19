<template>
  <base-page :header="header" :content="content" :footer="footer">
    <template v-slot:pre-content>
      <section class="u-content-type u-content-type--module u-article">
        <div class="u-article__header" :class="{ 'u-article__header--centered': headerCentered}">
          <div class="u-surline u-article__info">
            <strong class="u-article__category" v-if="displayCategory">{{ displayCategory }}</strong>
            <span class="u-article__date" v-if="date">{{ `| ${date}` }}</span>
          </div>

          <base-headline tag="h1" class="u-article__headline" v-if="headline">{{ headline }}</base-headline>

          <div class="u-article__author">
            <element-author v-bind="author" v-if="author"></element-author>
            <element-share-button-bar class="u-article__social"></element-share-button-bar>
          </div>
        </div>

        <contentful-image
          v-bind="imageDesktop"
          class="u-article__image-desktop-wrapper"
          width="1200"
          height="350"
          fit="FILL"
          v-if="imageDesktop"
        />

        <contentful-image
          v-bind="image"
          class="u-article__image-wrapper"
          width="1200"
          height="675"
          fit="FILL"
          v-if="image"
        />

        <div class="u-article__body">
          <div class="u-article__text">
            <markdown-text :text="text" :image-scaling="700" v-if="text"/>

            <article-addon class="u-article__addon" :category="mainCategory" :related-articles="relatedArticles"/>
          </div>

          <article-sidebar class="u-article__sidebar" :main-category="mainCategory" :filtered-id="sys.id"/>
        </div>
      </section>
    </template>
  </base-page>
</template>

<script>
import BasePage from '../../../components/_base/BasePage';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import { createGraphQlClient } from '../../../plugins/graphql';
import ContentTypes from '../../../assets/js/enums/ContentTypes';
import ArticleSidebar from '../../../components/molecule/ArticleSidebar.vue';
import ArticleAddon from '../../../components/molecule/ArticleAddon.vue';
import MarkdownText from '../../../components/atom/MarkdownText.vue';

const client = createGraphQlClient();

export default {
  name: 'ArticlePage',
  nuxtI18n: {
    paths: {
      en: '/blog/:slug/',
      de: '/blog/:slug/',
      fr: '/blog/:slug/',
      it: '/blog/:slug/',
      es: '/blog/:slug/'
    }
  },
  components: { MarkdownText, ArticleAddon, ArticleSidebar, BasePage },
  mixins: [FetchPageDataMixin],
  data() {
    return {
      relatedArticles: []
    }
  },
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.article);
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    text() {
      return this.fields?.text;
    },
    displayCategory() {
      if (this.fields?.categories) {
        return this.fields?.categories[0]?.fields?.label;
      } else {
        return this.fields?.category?.fields?.label;
      }
    },
    mainCategory() {
      if (this.fields?.categories) {
        return this.fields?.categories[0]?.fields;
      } else {
        return this.fields?.category?.fields;
      }
    },
    date() {
      const publishDate = this.fields?.published
      if (!publishDate) {
        return undefined;
      }
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(publishDate).toLocaleString(this.lang, dateOptions);
    },
    image() {
      return this.fields?.image;
    },
    imageDesktop() {
      return this.fields?.imageDesktop;
    },
    author() {
      return this.fields?.author;
    },
    headerCentered() {
      return this.fields?.headerCentered || false;
    }
  },
  async mounted() {
    if (this.mainCategory?.name && this.pageId) {
      this.relatedArticles = await client.getLatestBlogPostsByCategoryAsCategoryLinks(this.mainCategory.name, 3, this.pageId, this.lang);
    }
  }
}
</script>

<style scoped lang="scss">
.u-article {
  background-color: #fff;

  &__image-desktop-wrapper,
  &__image-wrapper {
    margin-top: 1.875rem;
  }

  &__image-desktop-wrapper {
    @include media-breakpoint-less-than($device-min-width-desktop) {
      display: none !important;
    }
  }

  &__image-desktop-wrapper + &__image-wrapper {
    @include media-breakpoint-up($device-min-width-desktop) {
      display: none !important;
    }
  }

  &__category {
    color: $color-productsup-cta--red;
  }

  &__author {
    display: flex;
    text-align: left;

    @include media-breakpoint-up($device-min-width-tablet) {

      justify-content: space-between;
      align-items: center;
    }

    @include media-breakpoint-less-than($device-max-width-mobile) {
      flex-direction: column;
      gap: 0.9375rem;
    }
  }

  &__body {
    margin-top: 1.875rem;

    @include tablet-above {
      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-areas:
      "text text sidebar"
      "addon addon sidebar";
      column-gap: 2rem;
    }
  }

  &__text {
    grid-area: text;
    background-color: white;

    @include tablet-above {
      padding: 2.5rem;
    }

    & > :first-child {
      margin-top: 0;
    }
  }

  &__addon {
    grid-area: addon;
  }

  &__sidebar {
    grid-area: sidebar;
  }

  &__header--centered {
    text-align: center;

    .u-article {
      &__author {
        gap: 10%;
        justify-content: center;
      }
    }
  }
}
</style>
