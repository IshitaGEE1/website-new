<script>
import BaseSearch from '../_base/BaseSearch.vue';
import ChannelTeaser from './ChannelTeaser.vue';
import ContentModule from '../_base/ContentModule.vue';

export default {
  components: { ContentModule, ChannelTeaser, BaseSearch },
  props: {
    categories: Array,
    channels: Array,
    columns: {
      type: [Number, String],
      default: 4
    },
    disableCategoryFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nameFilter: '',
      categoryFilter: ''
    }
  },
  computed: {
    _channels() {
      return this.channels.filter((c) =>
        c.name.toLowerCase().includes(this.nameFilter.toLowerCase())
        && (this.categoryFilter === '' || c.categories.includes(this.categoryFilter))
      )
    }
  }
}
</script>

<template>
  <div class="u-channel-grid">
    <div class="u-channel-grid__filters">
      <base-search v-model="nameFilter" class="u-channel-grid__name-filter" :placeholder="$t('channels.filter.search')"/>

      <select v-model="categoryFilter" class="u-channel-grid__category-filter" v-if="!disableCategoryFilter">
        <option value="">{{ $t('channels.filter.category') }}</option>
        <option v-for="category in categories" :value="category.name">{{ category.name }}</option>
      </select>
    </div>

    <div class="u-channel-grid__channels">
      <channel-teaser v-for="channel in _channels" :key="channel.name" v-bind="channel"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "assets/css/mixins";

.u-channel-grid {

  &__channels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem 4rem;
    margin-top: 3rem;
  }

  &__filters {
    margin-top: 2rem;
  }

  @include mobile {
    &__filters {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  @include tablet-above {
    &__filters {
      display: grid;
      gap: 4rem;
      grid-template-columns: repeat(3, 1fr);
    }

    &__channels {
      grid-template-columns: repeat(v-bind(columns), 1fr);
    }
  }
}
</style>
