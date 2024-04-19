<template>
  <select class="u-category-switch" @change="onChange">
    <option>{{ $t('controls.pleaseSelect')}}</option>
    <option
      v-for="(category, index) in categories"
      :key="index"
      :value="getOptionValue(category)"
    >
      {{ getOptionLabel(category) }}
    </option>
  </select>
</template>

<script>
import { createClient } from '../../plugins/contentful';

const client = createClient();

export default {
  name: 'CategorySwitch',
  props: {
    relatedType: {
      type: String,
      request: true
    }
  },
  data() {
    return {
      categories: []
    }
  },
  methods: {
    onChange($event) {
      const value = $event.target.value;
      if(value) {
        this.$emit('change', value);
      }
    },
    getOptionValue(category) {
      return category?.fields?.slug;
    },
    getOptionLabel(category) {
      return category?.fields?.label;
    }
  },
  async fetch() {
    const locale = this.$i18n.locale;

    await client.getEntries({
      content_type: 'elementCategory',
      'fields.relatedPageType': this.relatedType,
      locale,
      order: 'fields.slug'
    }).then((entries) => {
      this.categories = entries.items;
    }).catch(console.error);
  }
}
</script>

<style scoped lang="scss">
.u-category-switch {
  width: 100%;
}
</style>
