<template>
  <section
    :class="['u-content-type','u-content-type--module','u-hubspot-banner', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div class="u-hubspot-banner__body">
      <div class="u-hubspot-banner__text-wrapper">
        <base-surline v-if="surline">{{ surline }}</base-surline>

        <base-headline tag="h2" :text="headline" v-if="headline">{{ headline }}</base-headline>

        <base-subline v-if="subline">{{ subline }}</base-subline>

        <markdown-text :text="text" v-if="text"/>
      </div>

      <hubspot-form v-bind="hubspotForm" class="u-hubspot-banner__form">/</hubspot-form>
    </div>
  </section>
</template>

<script>
import MarkdownText from '../atom/MarkdownText';
import HubspotForm from '../molecule/HubspotForm';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BaseHeadline from '../_base/BaseHeadline';
import BaseSubline from '../_base/BaseSubline';
import BaseSurline from '../_base/BaseSurline';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';

export default {
  name: 'HubspotBanner',
  mixins: [ContentfulModuleMixin, BackgroundMixin],
  components: { BaseSurline, BaseSubline, BaseHeadline, HubspotForm, MarkdownText },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    surline() {
      return this.fields?.surline;
    },
    subline() {
      return this.fields?.subline;
    },
    text() {
      return this.fields?.text;
    },
    hubspotForm() {
      return this.fields?.hubspotForm;
    },
    backgroundColor() {
      return this.fields?.backgroundColor;
    }
  }
}
</script>

<style scoped lang="scss">
.u-hubspot-banner {
  &__body {
    @include media-breakpoint-up($device-min-width-desktop) {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
    }
  }

  &__text-wrapper {
    grid-column-end: span 5;
  }

  &__form {
    @include mobile {
      margin-top: 2.125rem;
    }

    grid-column-start: 7;
    grid-column-end: span 6;
  }
}
</style>
