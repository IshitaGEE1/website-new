<template>
  <component :is="tag" :class="['u-base-headline', {'u-base-headline--centered': center}]" v-if="!text">
    <slot></slot>
  </component>

  <component :is="tag" :class="['u-base-headline', {'u-base-headline--centered': center}]" v-html="_text" v-else>
  </component>
</template>

<script>
export default {
  name: 'BaseHeadline',
  props: {
    tag: {
      type: String,
      default: 'h1',
      validate: (val) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(val)
    },
    center: {
      type: Boolean,
      default: false
    },
    text: String
  },
  computed: {
    _text() {
      return this.text?.replaceAll('[[', '<span class="u-base-headline--contrast">')?.replaceAll(']]', '</span>');
    }
  }
}
</script>

<style lang="scss">
.u-base-headline {
  &--centered {
    text-align: center;

    &::before {
      margin-left: auto;
      margin-right: auto;
    }
  }

  > .u-base-headline--contrast {
    background: var(--headline-contrast);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

//FIXME this is shit - rework content sizing regarding this unnecessary 2nd MQ
h2.u-base-headline--centered {
  @include tablet-above {
    max-width: 66%;
    margin-left: auto;
    margin-right: auto;
  }

  @include media-breakpoint-up(1440px) {
    max-width: calc(1200px * 0.66);
  }
}
</style>
