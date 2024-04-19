<template>
  <section :class="['u-content-type u-content-type--module u-customer-quote']">
    <base-headline class="u-customer-quote__headline" tag="h2" :text="headline" v-if="headline">
      {{ headline }}
    </base-headline>

    <testimonial-card class="u-customer-quote__testimonial" v-bind="data"/>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import TestimonialCard from '../molecule/TestimonialCard';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from '../_base/BaseHeadline';

export default {
  name: 'CustomerQuote',
  components: { BaseHeadline, TestimonialCard },
  mixins: [ContentfulModuleMixin, DynamicKeywordObserver],
  computed: {
    headline() {
      return this.fields?.headline;
    }
  }
}
</script>

<style scoped lang="scss">
.u-customer-quote {
  &__headline {
    margin-bottom: 1.25rem;

    @include media-breakpoint-up($device-min-width-tablet) {
      text-align: center;
      margin-bottom: 3.75rem;
    }

    @include media-breakpoint-up($device-min-width-desktop) {
      margin-bottom: 6.25rem;
    }
  }
}
</style>
