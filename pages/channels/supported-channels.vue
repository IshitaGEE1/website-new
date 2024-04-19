<script>
import { createGraphQlClient } from '../../plugins/graphql';
import FetchPageDataMixin, {
  fetchPageData
} from '../../assets/js/mixins/FetchPageDataMixin';
import GlossaryCategoryFilter from '../../components/molecule/GlossaryCategoryFilter.vue';
import GlossaryListingBar from '../../components/organism/GlossaryListingBar.vue';
import MarkdownText from '../../components/atom/MarkdownText.vue';
import BasePage from '../../components/_base/BasePage.vue';
import ChannelListingBar from '../../components/organism/ChannelListingBar.vue';
import ContentModule from '../../components/_base/ContentModule.vue';
import ChannelTeaser from '../../components/molecule/ChannelTeaser.vue';
import ChannelGrid from '../../components/molecule/ChannelGrid.vue';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import ScrollTopButton from '../../components/atom/ScrollTopButton.vue';

const gqlClient = createGraphQlClient();
export default {
  name: 'SupportedChannelsPage',
  components: {
    ScrollTopButton,
    ChannelGrid,
    ChannelTeaser,
    ContentModule,
    ChannelListingBar,
    BasePage,
    MarkdownText,
    GlossaryListingBar,
    GlossaryCategoryFilter
  },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return await Promise.all([
      fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.channelOverviewPage),
      gqlClient.getSupportedChannels(null, ctx.i18n.locale),
      gqlClient.getChannelCategories(ctx.i18n.locale),
      gqlClient.getChannelOverviewPages(ctx.i18n.locale)
    ]).then((response) => {
      return {
        ...response[0],
        channels: response[1],
        categories: response[2],
        listings: response[3]
      }
    })
  }
}
</script>

<template>
  <base-page :content="content" :footer="footer" :header="header" class="u-channels-page">
    <template #pre-content>
      <channel-listing-bar :listings="listings"/>

      <content-module>
        <h1 class="u-channels-page__title">Supported channels</h1>

        <markdown-text class="u-channels-page__text" :text="fields.text" v-if="fields.text" />

        <channel-grid :categories="categories" :channels="channels" class="u-channels-page__grid"/>
      </content-module>
    </template>
  </base-page>
</template>

<style lang="scss" scoped>
.u-channels-page {

  &__scroll-top {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }

  @include mobile {
    &__title {
      text-align: center;
    }
  }

  @include tablet-above {
    &__title,
    &__text,
    &__grid {
      grid-column-end: span 12;
    }
  }
}
</style>
