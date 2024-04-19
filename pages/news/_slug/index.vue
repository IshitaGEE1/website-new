<template>
  <base-page :header="header" :content="content" :footer="footer">
    <template v-slot:pre-content>
      <section class="u-content-type u-content-type--module u-company-news">
        <div class="u-company-news__header">
          <div class="u-surline u-company-news__info">
            <strong class="u-company-news__category" v-if="displayCategory">{{ displayCategory }}</strong>
            <span class="u-company-news__date" v-if="date">{{ `| ${date}` }}</span>
          </div>

          <base-headline tag="h1" class="u-company-news__headline" v-if="headline">{{ headline }}</base-headline>

          <div class="u-company-news__author">
            <author v-bind="author" v-if="author"/>
            <share-button-bar/>
          </div>
        </div>

        <contentful-image
          v-bind="imageDesktop"
          class="u-company-news__image-desktop-wrapper"
          width="1200"
          height="350"
          fit="FILL"
          v-if="imageDesktop"
        />

        <contentful-image
          v-bind="image"
          class="u-company-news__image-wrapper"
          v-if="image"
          width="1200"
          height="675"
          cover
        />

        <div class="u-company-news__body" v-if="text">
          <markdown-text class="u-company-news__text" :text="text" v-if="text"/>
        </div>
      </section>
    </template>
  </base-page>
</template>

<script>
import { createClient } from '../../../plugins/contentful';;
import BasePage from '../../../components/_base/BasePage';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import ContentTypes from '../../../assets/js/enums/ContentTypes';
import Author from '../../../components/molecule/Author.vue';
import BaseHeadline from '../../../components/_base/BaseHeadline.vue';
import ShareButtonBar from '../../../components/molecule/ShareButtonBar.vue';
import ContentfulImage from '../../../components/_contentful/ContentfulImage.vue';
import MarkdownText from '../../../components/atom/MarkdownText.vue';

const client = createClient();

export default {
  name: 'CompanyNewsPage',
  nuxtI18n: {
    paths: {
      en: '/media/:slug/',
      de: '/neuigkeiten/:slug/',
      fr: '/actualites/:slug/',
      it: '/novita/:slug/',
      es: '/novedades/:slug/'
    }
  },
  components: { MarkdownText, ContentfulImage, ShareButtonBar, BaseHeadline, Author, BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.companyNews);
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    text() {
      return this.fields?.text;
    },
    displayCategory() {
      return this.fields?.categories && this.fields?.categories[0].fields?.label;
    },
    mainCategory() {
      return this.fields?.categories && this.fields?.categories[0].fields;
    },
    date() {
      const publishDate = this.fields?.published;
      if (!publishDate) {
        return undefined;
      }
      const currentLanguage = this.$i18n.locale;
      const date = new Date(publishDate);
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleString(currentLanguage, dateOptions);
    },
    image() {
      return this.fields?.image;
    },
    imageDesktop() {
      return this.fields?.imageDesktop;
    },
    author() {
      return this.fields?.author;
    }
  }
}
</script>

<style scoped lang="scss">
.u-company-news {
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

  &__social {
    display: flex;
    gap: 0.625rem;
  }

  &__body {
    margin-top: 1.875rem;

    display: flex;
    flex-flow: column nowrap;
    gap: 2rem;
    justify-content: center;

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row nowrap;
      gap: 1.5625rem;
    }
  }

  &__text {
    background-color: white;
    padding: 2.5rem;

    & > :first-child {
      margin-top: 0;
    }

    @include media-breakpoint-up($device-min-width-tablet) {
      width: calc(100% / 3 * 2);
    }
  }
}
</style>
