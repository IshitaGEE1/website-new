<template>
  <section
    :class="['u-content-module', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <slot name="head"></slot>

    <div class="u-content-module__body">
      <slot></slot>
    </div>

    <slot name="footer"></slot>
  </section>
</template>

<script>
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';

export default {
  name: 'ContentModule',
  mixins: [BackgroundMixin],
  props: {
    fields: Object,
    metadata: Object,
    sys: Object,
  }
}
</script>

<style lang="scss">
@import "assets/css/mixins";

.u-content-module {
  padding-top: var(--module-padding-top);
  padding-bottom: var(--module-padding-bottom);

  &__header,
  &__body,
  &__footer {
    @include set-module-width;

    @include desktop {
      display: grid;
      column-gap: 2rem;
      grid-template-columns: repeat(12, 1fr);
    }
  }
}

</style>
