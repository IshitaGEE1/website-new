<template>
  <base-image
    class="u-contentful-image"
    :class="[`u-contentful-image--${size}`, {'u-contentful-image--svg': isSvg}]"
    :src="processedUrl"
    :alt="processedAlt"
    :width="width"
    :height="height"
    :lazy="lazy"
    :cover="cover"
    v-on="$listeners"
  >
    <source :srcset="`${processedUrl}&fm=webp`" type="image/webp" v-if="!isSvg">
  </base-image>
</template>

<script>
import BaseImage from '../_base/BaseImage';
import ImageSizes from '../../assets/js/enums/ImageSizes';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export const FitOptions = {
  PAD: 'pad',
  FILL: 'fill',
  SCALE: 'scale'
}

export default {
  name: 'ContentfulImage',
  components: { BaseImage },
  mixins: [ContentfulElementMixin],
  props: {
    url: String,
    title: String,
    size: {
      type: String,
      required: false,
      default: ImageSizes.DEFAULT
    },
    width: {
      type: [String, Number],
      required: false,
      default: 800
    },
    height: {
      type: [String, Number],
      required: false,
      default: 450
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
    },
    fit: {
      type: String,
      required: false,
      default: undefined
    },
  },
  computed: {
    asset() {
      return this.fields;
    },
    isSvg() {
      return this.asset?.file?.url?.includes('.svg');
    },
    processedUrl() {
      let processedUrl = `${this.url || this.asset?.file?.url}?w=${this.width}&h=${this.height}`;
      if(this.fit) {
        processedUrl += `&fit=${this.fit}`
      }
      return processedUrl;
    },
    processedAlt() {
      return this.title || this.asset?.description || this.asset?.title || this.asset?.file?.fileName;
    }
  }
}
</script>

<style scoped lang="scss">
.u-contentful-image {

  &--small {
    ::v-deep img {
      max-height: 4rem !important;
    }
  }

  &--medium {
    ::v-deep img {
      max-height: 8rem !important;
    }
  }

  &--large {
    ::v-deep img {
      max-height: 16rem !important;
    }
  }

  &--xl {
    ::v-deep img {
      max-height: 32rem !important;
    }
  }
}
</style>
