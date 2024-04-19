<template>
  <base-page :header="header" :content="content" :footer="footer">
    <template v-slot:pre-content>
      <module-page-banner
        class="theme-light-blue"
        :image-width="310"
        :image-height="165"
        :options="bannerOptions"
        v-if="bannerOptions && isPartnerPage"
      />

      <section class="u-content-type u-content-type--module u-partner" v-if="isPartnerPage">
        <div class="u-partner__body">
          <element-markdown-text class="u-partner__post" :text="post" v-if="post"/>

          <div class="u-partner__profile">
            <div class="u-partner__profile-box">
              <element-markdown-text class="u-partner__profile-text" :text="profile" v-if="profile"/>

              <base-cta
                :url="homepageUrl"
                external
                block
                v-if="homepage"
              >
                {{ homepageLabel }}
              </base-cta>
            </div>
          </div>
        </div>
      </section>
    </template>
  </base-page>
</template>

<script>
import BasePage from '../../../components/_base/BasePage';
import ImageDirections from '../../../assets/js/enums/ImageDirections';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import ContentTypes from '../../../assets/js/enums/ContentTypes';

export default {
  name: 'PartnerPage',
  nuxtI18n: {
    paths: {
      en: '/partners/:slug/',
      de: '/partners/:slug/',
      fr: '/partenaires/:slug/',
      it: '/partner/:slug/',
      es: '/partners/:slug/'
    }
  },
  components: { BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.partner);
  },
  computed: {
    isPartnerPage() {
      return this.fields?.logo;
    },
    bannerOptions() {
      const preprocessedOptions = {
        image: this.fields?.logo,
        headline: this.fields?.displayName,
        subHeadline: this.fields?.categories && this.fields?.categories[0].fields?.label,
        direction: ImageDirections.IMAGE_RIGHT
      };
      return this.fields ? preprocessedOptions : undefined;
    },
    post() {
      return this.fields?.post;
    },
    profile() {
      return this.fields?.profile;
    },
    homepage() {
      return this.fields?.homepage?.fields;
    },
    homepageUrl() {
      return this.fields?.homepage?.fields?.url;
    },
    homepageLabel() {
      return this.fields?.homepage?.fields?.label;
    }
  }
}
</script>

<style scoped lang="scss">
.u-partner {
  &__body {
    display: flex;
    flex-flow: column nowrap;

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row nowrap;
    }
  }

  &__post {
    @include media-breakpoint-up($device-min-width-tablet) {
      flex: 2;
    }
  }

  &__profile {
    @include media-breakpoint-less-than($device-min-width-tablet) {
      margin-top: 1.875rem;
    }

    @include media-breakpoint-up($device-min-width-tablet) {
      width: calc(100% / 3);
      margin-left: 1.875rem;
    }
  }

  &__profile-box {
    padding: 2.5rem;
    @include set-box-shadow();
  }

  &__profile-text {
    ::v-deep * {
      &:first-child {
        margin-top: unset;
      }
    }
  }
}
</style>
