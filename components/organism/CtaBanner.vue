<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-cta-banner', { 'u-cta-banner--prominent': prominent }, theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <base-headline tag="h2" class="u-cta-banner__headline" :text="headline" center v-if="headline">{{ headline }}</base-headline>
    <base-subline class="u-cta-banner__sub-title" center v-if="subline">{{ subline }}</base-subline>

    <div class="u-cta-banner__footer">
      <component :is="actionType" v-bind="action" class="u-cta-banner__action" v-if="action"/>
    </div>
  </section>
</template>

<script>
import ContentfulOrganismMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from "../_base/BaseHeadline";
import BaseSubline from "../_base/BaseSubline";

export default {
  name: 'CtaBanner',
  components: {BaseSubline, BaseHeadline},
  mixins: [ContentfulOrganismMixin, BackgroundMixin, DynamicKeywordObserver],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subline() {
      return this.fields?.subTitle;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    },
    prominent() {
      return this.fields?.prominent || false;
    }
  }
}
</script>

<style scoped lang="scss">
.u-cta-banner {
  > * {
    @include media-breakpoint-up($device-min-width-tablet) {
      max-width: 65%;
    }
  }

  &--prominent {
    padding-top: 4.6875rem;
    padding-bottom: 4.6875rem;

    @include media-breakpoint-up($device-min-width-tablet) {
      padding-top: 7.5rem;
      padding-bottom: 7.5rem;
    }
  }

  &__headline {
    margin-top: 0;
    margin-bottom: 0;
  }

  &__sub-title {
    margin-top: 0.625rem;
    margin-bottom: 0;
  }

  &__footer {
    text-align: center;
    padding-top: 2.5rem;
  }
}
</style>
