<template>
  <article class="u-page">
    <page-header v-bind="header" v-if="header"/>

    <main>
      <slot name="pre-content"/>

      <slot>
        <component
          :is="item.contentType"
          v-for="(item, index) in content"
          :key="`${item.contentType}_${index}`"
          v-bind="item"
        />
      </slot>

      <slot name="post-content"/>
    </main>

    <portal-target name="modal"></portal-target>

    <component :is="footer.contentType" v-bind="footer" v-if="footer"/>
  </article>
</template>

<script>
import PageHeader from '../organism/PageHeader.vue';

export default {
  name: 'BasePage',
  components: { PageHeader },
  props: {
    header: Object,
    content: {
      type: Array,
      default: () => []
    },
    footer: Object
  }
}
</script>

<style scoped></style>
