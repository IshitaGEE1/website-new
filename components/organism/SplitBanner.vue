<template>
  <section
    :class="['u-content-type', 'u-content-type--banner', 'u-page-banner', 'u-split-banner', 'diver-shape', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div class="u-split-banner__body">
      <header>
        <base-surline class="u-split-banner__surline" v-if="surline">
          {{ surline }}
        </base-surline>

        <base-headline class="u-split-banner__headline" tag="h1" :text="headline" v-if="headline">
          {{ headline }}
        </base-headline>
      </header>

      <p class="u-split-banner__text" v-if="text">
        {{ text }}
      </p>

      <div class="u-split-banner__actions">
        <component :is="actionType" v-bind="action" class="u-split-banner__action" v-if="action"/>

        <base-cta :url="linkAction.url" external tertiary v-if="linkAction">
          {{ linkAction.label}}
        </base-cta>
      </div>

      <contentful-image
        class="u-split-banner__image"
        v-bind="foregroundImage"
        height="600"
        width="600"
        fit="PAD"
        v-if="foregroundImage"
      />

      <label class="u-split-banner__partner-headline">{{ partnerHeadline }}</label>

      <div class="u-split-banner__partners">
        <img
          class="u-split-banner__partner"
          v-for="(partner, index) in partnerLogos"
          :key="`banner_partner_${index}`"
          :src="partner.url"
          :alt="partner.title"
          width="82px"
          height="54px"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import ContentfulImage from '../_contentful/ContentfulImage';
import NavigationButton from '../atom/NavigationButton';
import BaseLink from '../_base/BaseLink';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSurline from "../_base/BaseSurline";
import BaseCta from '../_base/BaseCta';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';

export default {
  name: 'SplitBanner',
  components: { BaseCta, BaseSurline, BaseHeadline, BaseLink, NavigationButton, ContentfulImage },
  mixins: [ContentfulModuleMixin, DynamicKeywordObserver, BackgroundMixin],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    text() {
      return this.fields?.subline;
    },
    surline() {
      return this.fields?.surline;
    },
    foregroundImage() {
      return this.fields?.foregroundImage
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.fields?.action?.sys?.contentType?.sys?.id;
    },
    linkAction() {
      const linkAction = this.fields?.linkAction;
      return linkAction ? {
        url: linkAction.fields?.url,
        label: linkAction.fields?.label
      } : undefined;
    },
    partnerHeadline() {
      return this.fields?.partnerHeadline;
    },
    partnerLogos() {
      return this.fields?.partnerLogos?.map(i => ({ title: i.fields.title, ...i.fields.file }));
    }
  }
}
</script>

<style scoped lang="scss">
.u-split-banner {
  header {
    margin-top: 2rem;
  }

  &__text {
    margin-bottom: unset;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__partner-headline {
    display: block;
    margin-top: 3rem;
    text-align: center;
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.5625rem
  }

  &__partners {
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
  }

  @include desktop {
    &__body {
      display: grid;
      column-gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
      grid-template-areas:
        "head head head head head head image image image image image image"
        "text text text text text text image image image image image image"
        "actions actions actions actions actions actions image image image image image image"
        "partner-headline partner-headline partner-headline partner-headline partner-headline partner-headline image image image image image image"
        "logos logos logos logos logos logos logos logos . . . ."
    }

    header {
      grid-area: head;
      margin-top: 2.5rem;
    }

    &__text {
      grid-area: text;
    }

    &__actions {
      grid-area: actions;
      align-items: center;
      justify-content: initial;
      margin-top: 3rem;
    }

    &__image {
      grid-area: image;
      justify-self: center;
    }

    &__partner-headline {
      grid-area: partner-headline;
      display: initial;
      margin-top: 5rem;
      text-align: initial;
      font-family: "Good Headline Pro", sans-serif;
    }

    &__partners {
      grid-area: logos;
      margin-top: 1.5rem;
      justify-content: initial;
      gap: 1.5rem;
    }

    &__partner {
      width: 96px;
      height: 64px;
    }
  }
}
</style>
