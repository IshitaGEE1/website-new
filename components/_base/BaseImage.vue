<template>
  <picture :class="['u-base-image', {'u-base-image--cover': cover}]" v-on="$listeners">
    <slot></slot>
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="lazy ? 'lazy' : false"
      :style="`max-width: ${width}px; max-height: ${height}px`">
  </picture>
</template>

<script>
export default {
  name: 'BaseImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: false
    },
    width: {
      type: [String, Number],
      required: false,
    },
    height: {
      type: [String, Number],
      required: false,
    },
    lazy: {
      type: Boolean,
      required: false,
      default: false
    },
    cover: {
      type: Boolean,
      required: false,
      default: false
    }
  },
}
</script>

<style scoped lang="scss">
.u-base-image {
  display: block;

  img {
    display: block;
    margin: 0 auto;
  }

  &:not(.u-base-image--svg) {
    img {
      object-fit: contain;
      width: 100%;
      height: auto;
    }
  }

  &.u-base-image--cover {
    img {
      object-fit: cover;
      max-width: unset !important;
    }
  }
}
</style>
