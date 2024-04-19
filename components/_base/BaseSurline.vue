<template>
  <div :class="['u-base-surline', {'u-base-surline--centered': center}]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseSurline',
  props: {
    center: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped lang="scss">
.u-base-surline {

}
</style>
