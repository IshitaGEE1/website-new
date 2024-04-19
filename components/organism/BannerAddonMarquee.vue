<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-banner-marquee', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <div
      :class="['u-banner-marquee__head', {'u-banner-marquee__head--reduced': headlineReduced}]"
      v-if="headline || numbers"
    >
      <base-headline
        tag="h2"
        class="u-banner-marquee__headline"
        v-if="headline"
      >
        {{ headline }}
      </base-headline>

      <div class="u-banner-marquee__numbers" v-if="!headlineReduced">
        <div class="u-banner-marquee__number" v-for="(number, index) in numbers" :key="`stat_${index}`">
          <b>{{ number.name }}</b>
          <p>{{ number.text }}</p>
        </div>
      </div>

      <div class="u-banner-marquee__action" v-if="!headlineReduced && action">
        <component :is="actionType" v-bind="action"/>
      </div>
    </div>

    <base-marquee class="u-marquee-images__marquee" :duration="20" fading v-if="items">
      <base-marquee-slide class="u-marquee-images__slide" v-for="(item, index) in items" :key="`marquee_${index}`">
        <contentful-image class="u-marquee-images__image" v-bind="item" :width="180" :height="120"/>
      </base-marquee-slide>
    </base-marquee>
  </section>
</template>

<script>
import BaseMarqueeSlide from '../_base/BaseMarqueeSlide';
import BaseMarquee from '../_base/BaseMarquee';
import ContentfulImage from '../_contentful/ContentfulImage';
import BaseSubline from '../_base/BaseSubline';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import BaseHeadline from '../_base/BaseHeadline.vue';

export default {
  name: 'BannerAddonMarquee',
  components: { BaseHeadline, BaseMarquee, BaseMarqueeSlide, ContentfulImage },
  mixins: [ContentfulModuleMixin, BackgroundMixin],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    headlineReduced() {
      return this.fields?.headlineReduced;
    },
    items() {
      return this.fields?.items;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    },
    numbers() {
      return this.fields?.numbers?.map(n => ({ ...n.fields }));
    }
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-banner-marquee {
  &__head--reduced > &__headline {
    text-align: center;
    font-size: 1.5625rem;

    &::before {
      content: unset;
    }
  }

  &__numbers {
    display: flex;
    align-items: flex-start;
    height: fit-content;
    margin-top: 2.375rem;
  }

  &__number {
    flex: 1;
    display: inline-block;
    color: var(--text-color);

    & + & {
      margin-left: 2rem;
      border-left: 1px solid color-mix(in srgb, var(--text-color) 50%, transparent);
      padding-left: 2rem;
    }
  }

  &__number > b {
    font-family: "Good Headline Pro", sans-serif;
    font-size: 2rem;
    line-height: 1;
  }

  &__action {
    margin-top: 2.375rem;
  }

  .u-marquee-images__marquee {
    max-width: unset;
    margin-left: unset;
    margin-right: unset;
  }

  &__head + .u-marquee-images__marquee {
    margin-top: 50px;
  }

  @include media-breakpoint-up($breakpoint-tablet-desktop) {
    &__head {
      display: grid;
      column-gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
    }

    &__headline {
      grid-column-end: span 6;
    }

    &__head--reduced > &__headline {
      grid-column-end: span 12;
    }

    &__numbers {
      grid-column-end: span 6;
    }

    &__number {
      border-left: 1px solid color-mix(in srgb, var(--text-color) 50%, transparent);
      padding-left: 2rem;
    }

    &__number > b {
      font-size: 3rem;
    }

    &__action {
      grid-column-end: span 3;
      margin-top: 2rem;
    }

    &__head + .u-marquee-images__marquee {
      margin-top: 100px;
    }

    &__head--reduced + .u-marquee-images__marquee {
      margin-top: 50px;
    }
  }
}
</style>
