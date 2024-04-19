<template>
  <ul :class="['u-base-list', { 'u-base-list--no-marker': disableMarker }]">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'BaseList',
  props: {
    disableMarker: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.u-base-list {
  @extend %list;

  &--no-marker li::before {
    content: none;
  }
}
</style>
