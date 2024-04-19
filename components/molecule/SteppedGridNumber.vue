<template>
  <section class="u-stepped-grid-number">
    <base-headline class="u-stepped-grid-number__headline" tag="h3" :text="headline"></base-headline>

    <div class="u-stepped-grid-number__wrapper">
      <p class="u-stepped-grid-number__text cut-off-shape" v-html="text"></p>
    </div>
  </section>
</template>

<script>
import BaseHeadline from '../_base/BaseHeadline.vue';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'SteppedGridNumber',
  components: { BaseHeadline },
  mixins: [ContentfulElementMixin],
  props: {
    borderEnabled: Boolean
  },
  computed: {
    headline() {
      return this.fields?.name;
    },
    text() {
      return this.fields?.text;
    }
  }
}
</script>

<style scoped lang="scss">
.u-stepped-grid-number {
  position: relative;
  padding-top: 3.75rem;

  &__headline {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    font-size: 8rem;
  }

  &__wrapper {
    height: 100%;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  }

  &__text {
    margin: unset;
    text-align: center;
    height: 100%;
    display: inline-flex;
    align-items: center;

    &.cut-off-shape {
      background-color: #fff;
      padding: 4rem 2rem 2rem;
    }
  }
}
</style>
