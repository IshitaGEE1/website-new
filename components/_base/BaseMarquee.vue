<template>
  <div
    :class="['u-base-marquee', {'u-base-marquee--reverse': reverse, 'u-base-marquee--fading': fading}]"
    :style="{'--displayed-elements': displayCount, '--marquee-animation-duration': `${duration}s`}"
  >
    <ul class="u-base-marquee__content" ref="content">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Marquee',
  props: {
    duration: {
      type: Number,
      default: 10
    },
    displayCount: {
      type: Number,
      default: 10
    },
    reverse: {
      type: Boolean,
      default: false
    },
    fading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const marqueeElementsDisplayed = getComputedStyle(this.$el).getPropertyValue('--displayed-elements');
    const marqueeContent = this.$refs.content;

    this.$el.style.setProperty('--marquee-elements', marqueeContent.children.length);

    for (let i = 0; i < marqueeElementsDisplayed; i++) {
      marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-base-marquee {
  --fading-width: 300px;
  --gap: 4rem;
  --marquee-width: 100%;
  --marquee-element-width: 180px;

  @include mobile {
    --displayed-elements: 4 !important;
  }

  @include tablet {
    --displayed-elements: 6 !important;
  }

  width: var(--marquee-width);
  overflow: hidden;
  position: relative;

  &__content {
    margin: unset;
    padding: unset;
    height: 100%;
    display: flex;
    animation: scrolling var(--marquee-animation-duration) linear infinite;
  }

  &--reverse {
    .u-base-marquee__content {
      animation: scrolling var(--marquee-animation-duration) linear infinite reverse;
    }
  }

  &--fading {
    --webkit-mask-image: linear-gradient(to left, transparent 0%, #000 100px, #000 calc(100% - var(--fading-width)), transparent 100%);
    mask-image: linear-gradient(to left, transparent 0%, #000 100px, #000 calc(100% - var(--fading-width)), transparent 100%);
  }

  &__content ::v-deep li {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: var(--marquee-element-width);
    max-height: 100%;
    font-size: calc(var(--marquee-height) * 3 / 4);
    white-space: nowrap;
    margin-left: var(--gap);
  }

  &__content ::v-deep img {
    width: 100%;
  }
}

/* .marquee-content:hover {
  animation-play-state: paused;
} */
@keyframes scrolling {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-1 * (var(--marquee-element-width) + var(--gap)) * var(--marquee-elements)));
  }
}
</style>
