<template>
  <div class="u-article-addon">
    <base-headline tag="h4" class="u-article-addon__headline" v-if="headingAutomaticContent">
      {{ headingAutomaticContent }}
    </base-headline>

    <base-list>
      <li v-for="(article, index) in relatedArticles" :key="`related_${index}`">
        <category-link v-bind="article"/>
      </li>

      <li v-if="categoryOverviewPage">
        <base-link v-bind="categoryOverviewPage"></base-link>
      </li>
    </base-list>

    <base-headline tag="h4" class="u-article-addon__headline" v-if="headingStaticContent">
      {{ headingStaticContent }}
    </base-headline>

    <base-list v-if="relatedGuide || relatedSolution || relatedVideo">
      <li v-if="relatedGuide">
        <category-link v-bind="relatedGuide" :category-label="categoryName"/>
      </li>
      <li v-if="relatedSolution">
        <category-link v-bind="relatedSolution" :category-label="categoryName"/>
      </li>
      <li v-if="relatedVideo">
        <category-link v-bind="relatedVideo" :category-label="categoryName"/>
      </li>
    </base-list>
  </div>
</template>

<script>
import CategoryLink from '../atom/CategoryLink';
import TestimonialCard from './TestimonialCard';
import BaseLink from '../_base/BaseLink';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import BaseHeadline from '../_base/BaseHeadline';
import BaseList from '../_base/BaseList';

export default {
  name: 'ArticleAddon',
  components: { BaseList, BaseHeadline, ContentfulPageLink, BaseLink, TestimonialCard, CategoryLink },
  props: {
    category: {
      type: Object,
      required: true
    },
    relatedArticles: {
      type: Array
    }
  },
  computed: {
    categoryName() {
      return this.category?.label;
    },
    headingAutomaticContent() {
      return this.category?.headingAutomaticContent?.replace('{{ category }}', this.categoryName);
    },
    categoryOverviewPage() {
      if(!this.category?.labelOverviewPage) {
        return undefined;
      }
      return {
        url: `${InternalLinkService.processLink(this.localePath('/blog'))}?category=${this.category.slug}`,
        label: this.category?.labelOverviewPage?.replace('{{ category }}', this.categoryName),
        external: false
      }
    },
    headingStaticContent() {
      return this.category?.headingStaticContent?.replace('{{ category }}', this.categoryName);
    },
    relatedGuide() {
      return this.category?.relatedGuide;
    },
    relatedSolution() {
      return this.category?.relatedSolution;
    },
    relatedVideo() {
      return this.category?.relatedVideo;
    }
  },
}
</script>

<style scoped lang="scss">
.u-article-addon {
  &__headline {
    margin-top: 4.375rem;
  }
}
</style>
