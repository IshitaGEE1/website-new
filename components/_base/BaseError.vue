<template>
  <div class="u-error">
    <slot>Unknown ERROR</slot>
  </div>
</template>

<script>
export default {
  name: 'BaseError',
}
</script>

<style scoped lang="scss">
.u-error {
  border: 0.125rem solid black;
  border-radius: 0.5rem;
  padding: 2rem;
  background-color: indianred;
  color: #fff;

  * {
    color: inherit;
  }
}
</style>
