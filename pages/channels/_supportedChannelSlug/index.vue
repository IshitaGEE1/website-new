<script>
import FetchPageDataMixin, {
  fetchPageData
} from "../../../assets/js/mixins/FetchPageDataMixin";
import BasePage from "../../../components/_base/BasePage.vue";
import ContentTypes from "../../../assets/js/enums/ContentTypes";
import { createGraphQlClient } from "../../../plugins/graphql";
import ChannelListingBar from "../../../components/organism/ChannelListingBar.vue";
import ChannelGrid from "../../../components/molecule/ChannelGrid.vue";
import ContentModule from "../../../components/_base/ContentModule.vue";
import BaseHeadline from "../../../components/_base/BaseHeadline.vue";
import BaseList from "../../../components/_base/BaseList.vue";
import ContentfulPageLink from "../../../components/_contentful/ContentfulPageLink.vue";
import BaseLink from "../../../components/_base/BaseLink.vue";
import MarkdownText from "../../../components/atom/MarkdownText.vue";

const gqlClient = createGraphQlClient();

export default {
  name: "ChannelPage",
  components: {
    MarkdownText,
    BaseLink,
    ContentfulPageLink,
    BaseList,
    BaseHeadline,
    ContentModule,
    ChannelGrid,
    ChannelListingBar,
    BasePage
  },
  mixins: [FetchPageDataMixin],
  async asyncData(ctx) {
    return await Promise.all([
      fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.channelPage),
      gqlClient.getChannelOverviewPages(ctx.i18n.locale),
      gqlClient.getChannelCategories(ctx.i18n.locale),
      gqlClient.getExportChannels(ctx.i18n.locale)
    ]).then(response => {
      return {
        ...response[0],
        listings: response[1],
        categories: response[2],
        exports: response[3]
      };
    });
  },
  computed: {
    channelName() {
      return this.fields?.linkedChannel?.fields?.name;
    },
    channelDescription() {
      return this.fields?.linkedChannel?.fields?.description;
    },
    channelExports() {
      if (!this.fields?.linkedChannel?.fields?.exportChannels) {
        return [];
      }

      return this.fields?.linkedChannel?.fields?.exportChannels.map(i => {
        const exportChannelEntry = this.exports.find(
          e => e.name === i.fields.name
        );

        return {
          name: i.fields.name,
          url: exportChannelEntry.slug
            ? [exportChannelEntry?.channel?.url, exportChannelEntry?.slug].join(
                "/"
              )
            : undefined
        };
      });
    },
    channelCategories() {
      if (!this.fields?.linkedChannel?.fields?.categories) {
        return [];
      }

      return this.fields?.linkedChannel?.fields?.categories.map(i => {
        const categoryEntry = this.categories.find(
          c => c.name === i.fields?.name
        );

        return {
          name: i.fields.name,
          url: categoryEntry.url
        };
      });
    },
    _relatedArticles() {
      if (!this.fields?.relatedArticles) {
        return [];
      }

      return (
        this.fields?.relatedArticles
          .filter(i => i.fields?.urlSubfolder && i.fields?.slug)
          .map(i => ({
            headline: i.fields?.title,
            url: i.fields?.urlSubfolder + i.fields?.slug
          })) || []
      );
    }
  }
};
</script>

<template>
  <base-page
    :content="content"
    :footer="footer"
    :header="header"
    class="u-channels-page"
  >
    <template #pre-content>
      <channel-listing-bar :listings="listings" v-if="listings" />

      <content-module>
        <base-headline
          class="u-channels-page__title"
          tag="h1"
          v-if="channelName"
          >{{ channelName }}</base-headline
        >

        <markdown-text
          class="u-channels-page__description"
          :text="channelDescription"
          v-if="channelDescription"
        />

        <template v-if="channelExports.length > 0">
          <h3 class="u-channels-page__exports-line">
            Overview of export channels
          </h3>
          <base-list class="u-channels-page__exports">
            <li
              class="u-channels-page__export-channel"
              v-for="channel in channelExports"
              :key="`exports_${channel.name}`"
            >
              <contentful-page-link
                class="u-channels-page__category"
                :label="channel.name"
                :url="channel.url"
                :external="false"
              />
            </li>
          </base-list>
        </template>

        <template v-if="channelCategories.length > 0">
          <div class="u-channels-page__categories">
            Categories:
            <contentful-page-link
              class="u-channels-page__category"
              v-for="category in channelCategories"
              :key="`category_${category.name}`"
              :label="category.name"
              :url="category.url"
              :external="false"
            />
          </div>
        </template>

        <template v-if="_relatedArticles.length > 0">
          <h3 class="u-channels-page__articles-line">Related Articles</h3>
          <base-list class="u-channels-page__articles" disable-marker>
            <li
              v-for="article in _relatedArticles"
              class="u-channels-page__export-channel"
            >
              <contentful-page-link
                :url="article.url"
                :label="article.headline"
                :external="false"
                :key="`glossary_term_${article.url}`"
              />
            </li>
          </base-list>
        </template>
      </content-module>
    </template>
  </base-page>
</template>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-channels-page {
  &__categories {
    margin-top: 3rem;
    margin-bottom: 3rem;
    font-size: 1.25rem;
    line-height: 1.3;
    letter-spacing: 0.005em;
  }

  &__category {
    display: block;
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
