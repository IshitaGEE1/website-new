<template>
  <div class="u-content-type u-sticky-cta"
       :class="{ 'u-sticky-cta--mobile': onMobile, 'u-sticky-cta--tablet': onTablet, 'u-sticky-cta--desktop': onDesktop }"
  >
    <div class="u-sticky-cta__body">
      <base-cta class="u-sticky-cta__action" @click="scrollToHubspotForm">
        {{ label }}
      </base-cta>
    </div>
  </div>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import MarkdownText from '../atom/MarkdownText';
import BaseCta from '../_base/BaseCta';

export default {
  name: 'StickyCta',
  components: { BaseCta, MarkdownText },
  mixins: [ContentfulModuleMixin],
  computed: {
    label() {
      return this.fields?.label || 'MISSING LABEL';
    },
    onMobile() {
      return this.fields?.onMobile;
    },
    onTablet() {
      return this.fields?.onTablet;
    },
    onDesktop() {
      return this.fields?.onDesktop;
    }
  },
  mounted() {
    if(this.onMobile) {
      this.$parent.$el.classList.add('u-page--mobile-sticky-banner')
    }
    if(this.onTablet) {
      this.$parent.$el.classList.add('u-page--tablet-sticky-banner')
    }
    if(this.onDesktop) {
      this.$parent.$el.classList.add('u-page--desktop-sticky-banner')
    }
  },
  methods: {
    scrollToHubspotForm() {
      const hubspotForm = this.$parent.$el.querySelector('.u-hubspot-form');

      if(hubspotForm) {
        hubspotForm.scrollIntoView();
        return;
      }

      const hubspotButton = this.$parent.$el.querySelector('.u-hubspot-button > button');
      if(hubspotButton) {
        hubspotButton.click();
        return;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.u-sticky-cta {
  display: none;
  position: fixed;
  background-color: white;
  left: 0;
  bottom: 0;
  box-shadow: 0 0.0625rem 0.125rem 0.0625rem rgb(0 0 0 / 15%);
  width: 100vw;
  height: var(--height-sticky);

  &__body {
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }

  &__action {
    @include media-breakpoint-less-than($device-min-width-tablet) {
      display: block;
      width: 100%;
    }
  }

  &.u-sticky-cta--mobile {
    @include media-breakpoint-less-than($device-min-width-tablet) {
      display: block;
    }
  }

  &.u-sticky-cta--tablet {
    @include media-breakpoint-between($device-min-width-tablet, $device-min-width-desktop) {
      display: block;
    }
  }

  &.u-sticky-cta--desktop {
    @include media-breakpoint-up($device-min-width-desktop) {
      display: block;
    }
  }
}
</style>
