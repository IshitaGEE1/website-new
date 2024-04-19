<template>
  <section
    :class="['u-content-type', 'u-content-type--module', 'u-blog-posts-teaser', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
    v-if="visible"
  >
    <base-headline class="u-blog-posts-teaser__headline" tag="h3" :text="headline" :center="centered">
      {{ headline }}
    </base-headline>

    <markdown-text class="u-blog-posts-teaser__text" v-bind="{ text, center: centered }" v-if="text"/>

    <div class="u-blog-posts-teaser__teasers">
      <article-teaser-card class="u-blog-posts-teaser__teaser" v-for="item in teasers" :key="item.url" v-bind="item"/>
    </div>
  </section>
</template>

<script>
import MarkdownText from '../atom/MarkdownText';
import BaseHeadline from '../_base/BaseHeadline';
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import ArticleTeaserCard from '../molecule/ArticleTeaserCard';
import { createGraphQlClient } from '../../plugins/graphql';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';

const gqlClient = createGraphQlClient();

export default {
  name: 'BlogPostsTeaser',
  mixins: [ContentfulModuleMixin, BackgroundMixin],
  components: { ArticleTeaserCard, BaseHeadline, MarkdownText },
  data() {
    return {
      teasers: []
    }
  },
  async fetch() {
    const category = this.fields?.category?.fields?.name;

    await gqlClient.getBlogPostsTeaserByCategory(this.$i18n.locale, category).then(r => this.teasers = r);
  },
  computed: {
    category() {
      return this.fields?.category?.fields?.name;
    },
    headline() {
      return this.fields?.headline;
    },
    text() {
      return this.fields?.text;
    },
    centered() {
      return this.fields?.centered || false;
    },
    visible() {
      return this.teasers?.length > 0;
    }
  }
}
</script>

<style scoped lang="scss">
.u-blog-posts-teaser {

  &__teasers {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 3.75rem;
  }

  @include tablet-above {
    &__teasers {
      flex-flow: row wrap;
      justify-content: center;
    }

    &__teaser {
      width: calc(100% / 2 - 1rem);
      height: auto;
    }
  }

  @include desktop {
    &__teasers {
      flex-wrap: nowrap;
      justify-content: center;
    }

    &__teaser {
      width: calc(100% / 3);
    }
  }
}
</style>
