<script>
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import BasePage from '../../../components/_base/BasePage.vue';
import ContentTypes from '../../../assets/js/enums/ContentTypes';
import ChannelListingBar from '../../../components/organism/ChannelListingBar.vue';
import ContentModule from '../../../components/_base/ContentModule.vue';
import BaseList from '../../../components/_base/BaseList.vue';
import ContentfulPageLink from '../../../components/_contentful/ContentfulPageLink.vue';
import BaseHeadline from '../../../components/_base/BaseHeadline.vue';
import { createGraphQlClient } from '../../../plugins/graphql';
import MarkdownText from '../../../components/atom/MarkdownText.vue';

const gqlClient = createGraphQlClient();

export default {
  name: 'ChannelExportPage',
  components: { MarkdownText, BaseHeadline, ContentfulPageLink, BaseList, ContentModule, ChannelListingBar, BasePage },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    let result = await Promise.all([
      fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.channelPage),
      gqlClient.getChannelOverviewPages(ctx.i18n.locale)
    ]).then((response) => {
      return {
        ...response[0],
        listings: response[1]
      }
    });

    result.parent = await gqlClient.getExportChannels(
      ctx.i18n.locale,
      undefined,
      result.fields?.linkedChannel?.fields?.name
    ).then((response) => response[0].channel);

    return result;
  },
  computed: {
    channelName() {
      return this.fields?.linkedChannel?.fields?.name;
    },
    channelDescription() {
      return this.fields?.linkedChannel?.fields?.description;
    }
  }
}
</script>

<template>
  <base-page :content="content" :footer="footer" :header="header" class="u-channels-page">
    <template #pre-content>
      <channel-listing-bar :listings="listings"/>

      <content-module>
        <div class="u-channels-page__title">
          <contentful-page-link :external="false" :url="parent.url">
            <base-headline tag="h1">{{ parent.name }}</base-headline>
          </contentful-page-link>

          <base-headline tag="h1">&nbsp;/&nbsp;{{ channelName }}</base-headline>
        </div>

        <markdown-text class="u-channels-page__description" :text="channelDescription" v-if="channelDescription" />
      </content-module>
    </template>
  </base-page>
</template>

<style lang="scss" scoped>
@import "assets/css/mixins";

.u-channels-page {

  &__title {
    display: flex;
    align-items: baseline;
  }

  &__categories {
    margin-top: 3rem;
    margin-bottom: 3rem;
    font-size: 1.25rem;
    line-height: 1.3;
    letter-spacing: 0.005em;
  }

  @include tablet-above {
    &__title,
    &__description,
    &__exports-line,
    &__exports,
    &__categories,
    &__articles-line,
    &__articles {
      grid-column-end: span 12;
    }

    &__categories {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
}
</style>
