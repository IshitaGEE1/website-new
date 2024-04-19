<template>
  <section
    class="u-content-type u-content-type--module u-type-form-widget"
    :style="{'--background-color': backgroundColor, '--body-height': height}"
  >
    <div
      class="u-type-form-widget__body"
      :data-tf-widget="widgetId"
      data-tf-iframe-props="title=Matury Model"
      data-tf-medium="snippet"
    ></div>
    <script type="text/javascript" src="https://embed.typeform.com/next/embed.js"></script>
  </section>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';

export default {
  name: 'TypeFormWidget',
  mixins: [ContentfulModuleMixin],
  computed: {
    widgetId() {
      return this.fields?.widgetId;
    },
    backgroundColor() {
      return this.fields?.backgroundColor;
    },
    height() {
      return this.fields?.height;
    }
  }
}
</script>

<style scoped lang="scss">
.u-type-form-widget {
  --background-color: transparent;

  background-color: var(--background-color);

  &__body {
    height: var(--body-height);
  }
}
</style>
