<template>
  <a
    class="u-base-link"
    :href="url"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot>{{ label }}</slot>
  </a>
</template>

<script>
export default {
  name: 'BaseLink',
  props: {
    url: String,
    label: String,
    external: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.u-base-link {
  @extend %link;
}
</style>
