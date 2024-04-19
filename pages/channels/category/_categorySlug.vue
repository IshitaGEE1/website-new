<script>
import { defineComponent } from 'vue'
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import ContentTypes from '../../../assets/js/enums/ContentTypes';
import BasePage from '../../../components/_base/BasePage.vue';
import ChannelListingBar from '../../../components/organism/ChannelListingBar.vue';
import ContentModule from '../../../components/_base/ContentModule.vue';
import ContentfulPageLink from '../../../components/_contentful/ContentfulPageLink.vue';
import BaseHeadline from '../../../components/_base/BaseHeadline.vue';
import { createGraphQlClient } from '../../../plugins/graphql';
import BaseList from '../../../components/_base/BaseList.vue';
import MarkdownText from '../../../components/atom/MarkdownText.vue';

const gqlClient = createGraphQlClient();

export default defineComponent({
  name: 'CategoryPage',
  components: { MarkdownText, BaseList, BaseHeadline, ContentfulPageLink, ContentModule, ChannelListingBar, BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    let result = await Promise.all([
      fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.channelCategoryPage),
      gqlClient.getChannelOverviewPages(ctx.i18n.locale),
    ]).then((response) => {
      return {
        ...response[0],
        listings: response[1],
      }
    });

    result.channels = await gqlClient.getChannelsByCategory(ctx.i18n.locale, undefined, result.fields?.linkedCategory?.fields?.name);

    return result;
  },
  computed: {
    categoryName() {
      return this.fields?.linkedCategory?.fields?.name;
    },
    categoryDescription() {
      return this.fields?.linkedCategory?.fields?.description;
    },
  }
})
</script>

<template>
  <base-page :content="content" :footer="footer" :header="header" class="u-channel-category-page">
    <template #pre-content>
      <channel-listing-bar :listings="listings"/>

      <content-module>
        <base-headline class="u-channel-category-page__title" tag="h1">{{ categoryName }}</base-headline>

        <markdown-text class="u-channel-category-page__description" :text="categoryDescription" v-if="categoryDescription" />

        <base-list class="u-channel-category-page__channels">
          <li class="u-channel-category-page__channel" v-for="channel in channels" :key="`exports_${channel.name}`">
            <contentful-page-link
              :label="channel.name"
              :url="channel.url"
              :external="false"
            />
          </li>
        </base-list>
      </content-module>
    </template>
  </base-page>
</template>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-channel-category-page {

  &__channels {
    margin-top: 3rem;
  }

  @include tablet-above {
    &__title,
    &__description,
    &__channels {
      grid-column-end: span 12;
    }
  }
}
</style>
