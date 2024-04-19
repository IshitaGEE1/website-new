<template>
  <content-module class="u-faq-section" v-bind="data">
    <base-headline tag="h2" class="u-faq-section__headline" :text="headline"></base-headline>

    <div class="u-faq-section__items">
      <template v-for="(item, index) in items">
        <faq-item class="u-faq-section__item" v-bind="item" :open="index === 0 && openFirstItem"></faq-item>
      </template>
    </div>
  </content-module>
</template>

<script>
import BaseHeadline from '../_base/BaseHeadline.vue';
import MarkdownText from '../atom/MarkdownText.vue';
import ContentModule from '../_base/ContentModule.vue';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import FaqItem from '../molecule/FaqItem.vue';

export default {
  name: 'FaqSection',
  components: { FaqItem, ContentModule, MarkdownText, BaseHeadline },
  mixins: [ContentfulModuleMixin],
  computed: {
    headline() {
      return this.fields?.title;
    },
    items() {
      return this.fields?.items.map(i => {
        return {
          question: i.fields?.title,
          answer: i.fields?.answer
        }
      })
    },
    openFirstItem() {
      return this.fields?.openFirstItem
    }
  },
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-faq-section {
  &__items {
    margin-top: 3rem;
    border-top: 1px solid rgba(0 0 0 / 0.1);
    border-bottom: 1px solid rgba(0 0 0 / 0.1);
  }

  &__item {
    & + & {
      border-top: 1px solid rgba(0 0 0 / 0.1);
    }
  }

  @include desktop {
    &__headline {
      grid-column-end: span 5;
      grid-row-end: span 2;
    }

    &__items {
      grid-column-end: span 7;
    }
  }
}
</style>
