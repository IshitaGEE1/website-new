<template>
  <div class="u-glossary-group">
    <h3
      :class="['u-glossary-group__headline', { 'u-glossary-group__headline--underlined': underline}]"
      v-if="identifier"
    >
      {{ identifier }}
    </h3>
    <ul class="u-glossary-group__terms">
      <li class="u-glossary-group__term" v-for="(item, index) in items">
        <contentful-page-link
          :url="item.url"
          :label="item.headline"
          :external="false"
          :key="`glossary_term_${identifier}_${index}`"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GlossaryGroup',
  props: {
    identifier: {
      type: [String, Number]
    },
    items: {
      type: [Object, Array],
      required: true
    },
    underline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.u-glossary-group {
  &__headline--underlined {
    border-bottom: 1px solid var(--headline-color)
  }

  &__terms {
    list-style: none;
    padding: unset;
  }

  &__term {
    & + & {
      margin-top: 1rem;
    }
  }
}
</style>
