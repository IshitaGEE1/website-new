<template>
  <base-page :header="header" :content="content" :footer="footer">
    <template v-slot:pre-content>
      <section class="u-content-type u-content-type--module u-customer-story" v-if="isCustomerStory">
        <div class="u-customer-story__content">
          <base-headline tag="h1" class="u-customer-story__headline" center v-if="headline">
            {{ headline }}
          </base-headline>

          <share-button-bar class="u-customer-story__share-buttons"/>

          <contentful-image
            class="u-customer-story__banner-wrapper"
            v-bind="bannerImage"
            width="1200"
            height="675"
            v-if="bannerImage"
          />

          <base-video
            class="u-customer-story__banner-wrapper"
            :url="videoUrl"
            :video-dimensions="videoDimensions"
            v-if="videoUrl"
          />

          <ul class="u-customer-story__achievements" v-if="achievements">
            <li v-for="(achievement, index) in achievements" :key="`achievement_${index}`">
              <card v-bind="achievement" class="u-customer-story__achievement"/>
            </li>
          </ul>

          <div class="u-customer-story__body">
            <markdown-text class="u-customer-story__story" :text="story"/>

            <customer-sidebar class="u-customer-story__side-bar" v-bind="sidebarObject" v-if="sidebarObject"/>
          </div>
        </div>
      </section>
    </template>
  </base-page>
</template>

<script>
import VideoSettings from '../../../assets/js/settings/VideoSettings';
import BasePage from '../../../components/_base/BasePage';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import ContentTypes from '../../../assets/js/enums/ContentTypes';
import Card from '../../../components/molecule/Card.vue';
import MarkdownText from '../../../components/atom/MarkdownText.vue';
import CustomerSidebar from '../../../components/molecule/CustomerSidebar.vue';
import BaseVideo from '../../../components/_base/BaseVideo.vue';
import ContentfulImage from '../../../components/_contentful/ContentfulImage.vue';
import BaseHeadline from '../../../components/_base/BaseHeadline.vue';
import ShareButtonBar from '../../../components/molecule/ShareButtonBar.vue';

export default {
  name: 'CustomerPage',
  nuxtI18n: {
    paths: {
      en: '/customers/:slug/',
      de: '/kunden/:slug/',
      fr: '/clients/:slug/',
      it: '/clienti/:slug/',
      es: '/clientes/:slug/'
    }
  },
  components: { ShareButtonBar, BaseHeadline, ContentfulImage, BaseVideo, CustomerSidebar, MarkdownText, Card, BasePage },
  mixins: [FetchPageDataMixin],
  data() {
    return {
      videoDimensions: VideoSettings.DIMENSIONS_1200x675
    }
  },
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.customer);
  },
  computed: {
    isCustomerStory() {
      return this.fields?.customerLogo;
    },
    headline() {
      return this.fields?.headline;
    },
    bannerImage() {
      return this.fields?.image;
    },
    story() {
      return this.fields?.story;
    },
    achievements() {
      return this.fields?.achievements;
    },
    sidebarObject() {
      return {
        fields: {
          action: this.fields?.action,
          customerLogo: this.fields?.customerLogo,
          homepage: this.fields?.homepage,
          profile: this.fields?.profile,
          about: this.fields?.about
        }
      }
    },
    videoUrl() {
      return this.fields?.videoUrl;
    }
  }
}
</script>

<style scoped lang="scss">
.u-customer-story {
  background-color: #fff;

  &__share-buttons {
    justify-content: center;
  }

  &__banner-wrapper {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }

  &__achievements {
    --columnw-width: 100%;

    margin-bottom: 3rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: $gutter-size;
    list-style: none;
    padding: unset;

    > * {
      background-color: #fff;
      flex-basis: calc(var(--columnw-width) - #{$gutter-size});

      @include media-breakpoint-up($device-min-width-tablet) {
        --columnw-width: calc(100% / 2);
      }

      @include media-breakpoint-up($device-min-width-desktop) {
        --columnw-width: 25%;
      }
    }
  }

  &__achievement {
    height: 100%;
  }

  &__body {
    display: flex;
    flex-flow: column nowrap;
    gap: 2rem;

    @include media-breakpoint-up($device-min-width-tablet) {
      flex-flow: row nowrap;
    }
  }

  &__story {
    background-color: #fff;
    padding: 2rem;
    flex: 2;
  }
}
</style>
