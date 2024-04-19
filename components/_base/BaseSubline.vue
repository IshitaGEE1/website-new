<template>
  <div :class="['u-base-subline', {'u-base-subline--centered': center}]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseSubline',
  props: {
    center: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-base-subline {
  color: var(--subline-color);
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: .005em;
  margin-bottom: 1.5rem;

  &--centered {
    text-align: center;
  }
}
</style>
