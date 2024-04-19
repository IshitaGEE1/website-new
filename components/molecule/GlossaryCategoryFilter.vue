<template>
  <div class="u-glossary-category-filter">
    <h3 class="u-glossary-category-filter__headline">{{ headline }}</h3>
    <filter-options-cloud :options="options" @change="navigateToCategory"/>
  </div>
</template>

<script>
import FilterOptionsCloud from './FilterOptionsCloud';
import InternalLinkService from '../../assets/js/services/internalLink.service';

export default {
  name: 'GlossaryCategoryFilter',
  components: { FilterOptionsCloud },
  props: {
    headline: {
      type: String,
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    navigateToCategory(option) {
      this.$router.push({
        path: InternalLinkService.processLink(this.localePath(`/glossary/category/${option.value}`, this.$i18n.locale))
      })
    }
  }
}
</script>

<style scoped>

</style>
