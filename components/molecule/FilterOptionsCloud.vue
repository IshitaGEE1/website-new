<template>
  <div :class="['u-filter-option-cloud', {'u-filter-option-cloud--centered': center}]">
    <base-cta
      tertiary
      v-for="(option, index) in options"
      :key="`filteroption_${index}`"
      :class="[{ 'active': isActive(option.value) }]"
      @click="setActive(option.value)"
    >
      {{ option.label }}
    </base-cta>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseCta from '../_base/BaseCta.vue';

export default {
  name: 'FilterOptionsCloud',
  components: { BaseCta },
  props: {
    options: {
      type: Array,
      default: []
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: undefined
    }
  },
  computed: {
    ...mapGetters({
      selected: 'categoryFilter'
    })
  },
  watch: {
    active(value) {
      this.$emit('change', value);
    }
  },
  mounted() {
    this.active = this.options.find(o => o.value === this.selected);
  },
  methods: {
    setActive(optionSlug) {
      this.active = this.options.find(o => o.value === optionSlug);
    },
    isActive(optionSlug) {
      return this.active?.value === optionSlug;
    }
  }
};
</script>

<style scoped lang="scss">
.u-filter-option-cloud {
  display: flex;
  flex-wrap: wrap;

  &--centered {
    justify-content: center;
  }

  & > * {
    margin: .375rem;
  }
}
</style>
