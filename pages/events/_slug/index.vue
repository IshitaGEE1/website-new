<template>
  <base-page :header="header" :content="content" :footer="footer">
    <template v-slot:pre-content>
      <section class="u-content-type--module u-event" v-if="isEventpage">
        <header class="u-event__header">
          <base-surline class="u-event__surheadline" :center="headerCentered" v-if="surheadline">
            {{ surheadline }}
          </base-surline>

          <base-headline tag="h1" class="u-event__headline" :center="headerCentered" v-if="headline">
            {{ headline }}
          </base-headline>

          <base-subline class="u-event__subheadline" :center="headerCentered" v-if="subheadline">
            {{ subheadline }}
          </base-subline>

          <base-headline tag="h2" class="u-event__date" :center="headerCentered" v-if="date">
            {{ `Start: ${date}` }}
          </base-headline>

          <contentful-image
            v-bind="imageDesktop"
            class="u-event__image-desktop-wrapper"
            width="1200"
            height="350"
            fit="FILL"
            v-if="imageDesktop"
          />

          <contentful-image
            v-bind="image"
            class="u-event__image-wrapper"
            width="1200"
            height="675"
            cover
            v-if="image"
          />
        </header>

        <markdown-text class="u-event__description" :text="description" v-if="description"/>

        <aside class="u-event__sidebar">
          <hubspot-form class="u-event__form" :cut-off-shape="false" v-bind="hubspotForm" v-if="hubspotForm"/>
        </aside>
      </section>
    </template>
  </base-page>
</template>

<script>
import BasePage from '../../../components/_base/BasePage';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import ContentTypes from '../../../assets/js/enums/ContentTypes';
import HubspotForm from '../../../components/molecule/HubspotForm.vue';
import MarkdownText from '../../../components/atom/MarkdownText.vue';
import BaseSurline from '../../../components/_base/BaseSurline.vue';
import BaseHeadline from '../../../components/_base/BaseHeadline.vue';
import BaseSubline from '../../../components/_base/BaseSubline.vue';
import ContentfulImage from '../../../components/_contentful/ContentfulImage.vue';

export default {
  name: 'EventPage',
  nuxtI18n: {
    paths: {
      en: '/events/:slug/',
      de: '/events/:slug/',
      fr: '/evenements/:slug/',
      it: '/eventi/:slug/',
      es: '/eventos/:slug/'
    }
  },
  components: { ContentfulImage, BaseSubline, BaseHeadline, BaseSurline, BasePage, HubspotForm, MarkdownText },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.event);
  },
  computed: {
    isEventpage() {
      return this.sys?.contentType?.sys?.id === ContentTypes.pages.event;
    },
    surheadline() {
      return this.fields?.surheadline;
    },
    headline() {
      return this.fields?.headline;
    },
    subheadline() {
      return this.fields?.subheadline;
    },
    date() {
      const startingDate = this.fields?.date

      if (!startingDate) {
        return undefined;
      }
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      let formattedDate = new Date(startingDate).toLocaleString(this.lang, dateOptions);

      let timeOptions;
      switch (this.lang) {
        case 'it':
        case 'es':
          timeOptions = { hour: 'numeric', minute: 'numeric' };
          break;
        default:
          timeOptions = { hour: '2-digit' };
      }
      let formattedTime = new Date(startingDate).toLocaleString(this.lang, timeOptions);

      return `${formattedDate} | ${formattedTime}`;
    },
    image() {
      return this.fields?.image;
    },
    imageDesktop() {
      return this.fields?.imageDesktop;
    },
    description() {
      return this.fields?.description;
    },
    hubspotForm() {
      return this.fields?.hubspotForm;
    },
    headerCentered() {
      return this.fields?.headerCentered || false;
    }
  }
}
</script>

<style scoped lang="scss">
.u-event {
  --pup-green: #00cb33;

  @include set-module-width;
  background-color: #fff;

  &__headline {
    margin-top: 0;
  }

  &__subheadline {
    margin-bottom: 0.9375rem;
  }

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

  &__date {
    color: var(--pup-green);
    font-weight: normal;
  }

  &__description {
    margin-top: 1.875rem;
    background-color: white;

    & > :first-child {
      margin-top: 0;
    }
  }

  &__sidebar {
    margin-top: 1.875rem;
  }

  &__form {

    & :deep(h3) {
      text-align: center;
    }
  }

  @include desktop {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      "header header header"
      "text text sidebar";

    &__header {
      grid-area: header;
    }

    &__description {
      grid-area: text;
      padding: 2.5rem;
    }

    &__sidebar {
      grid-area: sidebar;
    }
  }
}
</style>
