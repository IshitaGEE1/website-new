<template>
  <content-module class="u-rating-banner" v-bind="data" :style="{ '--rating-count': ratingsCount }">
    <base-headline
      tag="h2"
      class="u-rating-banner__headline"
      :text="headline"
      :center="headlineCentered"
    ></base-headline>

    <base-carousel class="u-rating-banner__ratings" :options="carouselOptions">
      <base-carousel-slide v-for="(rating, index) in ratings" :key="`rating_${index}`">
        <img
          class="u-rating-banner__rating"
          :src="rating.url"
          :alt="rating.title"
          width="150"
          height="150"
        >
      </base-carousel-slide>
    </base-carousel>
  </content-module>
</template>

<script>
import ContentModule from '../_base/ContentModule.vue';
import BaseHeadline from '../_base/BaseHeadline.vue';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BaseImage from '../_base/BaseImage.vue';
import BaseCarousel from '../_base/BaseCarousel.vue';
import BaseCarouselSlide from '../_base/BaseCarouselSlide.vue';

export default {
  name: 'RatingBanner',
  components: { BaseCarouselSlide, BaseCarousel, BaseImage, BaseHeadline, ContentModule },
  mixins: [ContentfulModuleMixin],
  data() {
    return {
      carouselOptions: {
        type: 'slide',
        gap: '60px',
        perPage: 6,
        breakpoints: {
          768: {
            type: 'loop',
            autoWidth: true,
            focus: 'center',
            perPage: 1,
          },
        }
      }
    }
  },
  computed: {
    headline() {
      return this.fields?.title;
    },
    headlineCentered() {
      return this.fields?.titleAlignment === 'center';
    },
    ratings() {
      return this.fields?.ratings?.map(i => {
        const imageUrl = i.fields?.file?.url;
        return {
          ...i.fields?.file,
          title: i.fields?.title,
          url: imageUrl.includes('.svg') ? imageUrl : `${imageUrl}?fm=webp&w=150`
        }
      });
    },
    ratingsCount() {
      return this.ratings?.length || 1;
    }
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-rating-banner {
  --upper-spacing: 2.375rem;
  --ratings-per-slide: 6;
  --rating-width: 150px;
  --rating-height: 150px;
  --rating-gap: calc((100% - (var(--rating-width / var(--ratings-per-slide))) / (var(--ratings-per-slide) - 1)));

  &__ratings {
    margin-top: var(--upper-spacing);
  }

  &__rating {
    object-fit: contain;
  }

  @include tablet-above {
    --upper-spacing: 5.25rem;
    --item-width: calc(var(--max-content-width) / var(--rating-count) - var(--rating-gap));
  }

  @include desktop {
    &__headline {
      grid-column-end: span 6;
    }

    &__ratings {
      grid-column-start: 1;
      grid-column-end: span 12;
    }
  }
}
</style>
