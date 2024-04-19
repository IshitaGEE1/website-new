<template>
  <content-module class="u-stepped-grid" v-bind="data">
    <base-headline tag="h2" class="u-stepped-grid__headline" :text="headline"/>

    <div class="u-stepped-grid__items">
      <template v-for="(item, index) in items">
        <card class="u-stepped-grid__item" v-bind="item" v-if="isCard(item)" :key="`stepped_grid_item_${index}`"/>

        <stepped-grid-number
          class="u-stepped-grid__item"
          v-bind="item"
          :border-enabled="itemsBorderEnabled"
          :key="`stepped_grid_item_${index}`"
          v-else-if="isNumber(item)"
        />
      </template>
    </div>
  </content-module>
</template>

<script>
import ContentModule from '../_base/ContentModule.vue';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BaseHeadline from '../_base/BaseHeadline.vue';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import Card from '../molecule/Card.vue';
import SteppedGridNumber from '../molecule/SteppedGridNumber.vue';

export default {
  name: 'SteppedGrid',
  components: { SteppedGridNumber, Card, BaseHeadline, ContentModule },
  mixins: [ContentfulModuleMixin],
  computed: {
    headline() {
      return this.fields?.title;
    },
    items() {
      return this.fields?.items
    },
    itemsBorderEnabled() {
      return this.fields?.itemsBorder;
    }
  },
  methods: {
    isCard(item) {
      return item.sys.contentType.sys.id === ContentTypes.elements.card;
    },
    isNumber(item) {
      return item.sys.contentType.sys.id === ContentTypes.elements.number;
    }
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-stepped-grid {

  &__item {
    margin-top: 3rem;
  }

  @include desktop {
    &__headline {
      grid-column-end: span 6;
    }

    &__items {
      grid-column-end: span 12;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 6rem;
    }

    &__item {
      &:first-child {
        margin-top: 100px;
      }

      &:nth-child(2) {
        margin-top: 70px;
        margin-bottom: 30px;
      }

      &:nth-child(3) {
        margin-top: 40px;
        margin-bottom: 60px;
      }
    }
  }
}
</style>
