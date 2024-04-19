<template>
  <section class="u-content-type u-content-type--module u-carousel">
    <base-headline class="u-carousel__headline" tag="h2" :text="headline" center v-if="headline">{{ headline }}</base-headline>

    <base-carousel class="u-carousel__items" v-bind="{ autoplay }" v-if="items">
      <base-carousel-slide v-for="(item, index) in items" :key="`${item.sys.id}_${index}`">
        <component
          class="u-carousel__item"
          :is="item.sys.contentType.sys.id"
          v-bind="item"
        />
      </base-carousel-slide>
    </base-carousel>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import DynamicKeywordObserver from '../../assets/js/mixins/DynamicKeywordObserver';
import BaseHeadline from '../_base/BaseHeadline';
import BaseCarouselSlide from '../_base/BaseCarouselSlide';
import BaseCarousel from '../_base/BaseCarousel';

export default {
  name: 'Carousel',
  components: { BaseCarousel, BaseCarouselSlide, BaseHeadline },
  mixins: [ContentfulModuleMixin, DynamicKeywordObserver],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    items() {
      return this.fields?.items;
    },
    autoplay() {
      return this.fields?.autoplay;
    }
  }
}
</script>

<style scoped lang="scss">
.u-carousel {
  position: relative;

  &__items {

    &:not(:first-child) {
      margin-top: 1rem;
    }
  }

  &__item {
    padding: unset;
  }
}
</style>
