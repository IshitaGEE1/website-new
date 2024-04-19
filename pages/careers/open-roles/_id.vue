<template>
  <base-page class="u-job-page" v-bind="{ header, footer }">
    <div class="u-content-type u-content-type--module u-job-page__content">
      <base-link class="u-job-page__navigate-back" url="/careers/open-roles/" :external="false">View all jobs
      </base-link>
      <base-headline class="u-career-page__title" tag="h1">{{ title }}</base-headline>
      <base-subline v-if="departmentName">{{ departmentName }} - {{ parseLocation(location.name) }}</base-subline>
      <markdown-text class="u-job-page__content" :text="processedContent"/>
    </div>

    <embedded-greenhouse :job-id="jobId"/>
  </base-page>
</template>

<script>
import { unescape } from 'html-escaper';
import GreenhouseConfig, { GreenhouseAdapter } from '../../../plugins/greenhouse';
import EmbeddedGreenhouse from '../../../components/organism/EmbeddedGreenhouse';
import BasePage from '../../../components/_base/BasePage';
import MarkdownText from '../../../components/atom/MarkdownText';
import BaseHeadline from '../../../components/_base/BaseHeadline';
import BaseSurline from '../../../components/_base/BaseSurline';
import BaseSubline from '../../../components/_base/BaseSubline';
import BaseLink from '../../../components/_base/BaseLink';
import { fetchPageFooter, fetchPageHeader } from '../../../assets/js/mixins/FetchPageDataMixin';

export default {
  name: 'JobDetail',
  components: { BaseLink, BaseSubline, BaseSurline, BaseHeadline, MarkdownText, EmbeddedGreenhouse, BasePage },
  head() {
    return {
      title: `${this.title} - ${this.location.name}`,
      meta: [
        { name: 'title', content: `${this.title} - ${this.location.name}` },
        {
          name: 'description',
          content: `Want to work as a ${this.title} for Productsup? Become a part of a diverse and vibrant team. Apply today!`
        },
        { name: 'robots', content: 'index,follow' },
        { name: 'og:title', content: `${this.title} - ${this.location.name}` },
        { name: 'og:type', content: 'website' },
        {
          property: 'og:url',
          content: process.env.HOSTNAME + this.$route.path
        },
        {
          name: 'og:description',
          content: `Want to work as a ${this.title} for Productsup? Become a part of a diverse and vibrant team. Apply today!`
        },
        {
          name: 'og:image',
          content: 'https://images.ctfassets.net/q17uls4wkkdz/2fHhW3yCd4dtDa54l9NgO3/d4e05ab74467780311fb6e920f3f0c80/careers-open-graph-1200-630.png'
        }
      ],
      link: [
        this.canonicalLink
      ],
      script: [GreenhouseConfig]
    }
  },
  async asyncData(ctx) {
    const jobId = ctx.route.params.id.split('-').reverse()[0];
    return {
      ...await GreenhouseAdapter.getJob(jobId),
      header: await fetchPageHeader('7Hun6EdA6wPh1PmNKcKKiM', ctx.i18n.locale),
      footer: await fetchPageFooter('5IC4dzMXHs0jwxRSJR82Mi', ctx.i18n.locale)
    }
  },
  computed: {
    processedContent() {
      try {
        return unescape(this.content);
      } catch (e) {
        return '';
      }
    },
    departmentName() {
      return this.departments[0]?.name;
    },
    canonicalLink() {
      return {
        rel: 'canonical',
        href: process.env.HOSTNAME + this.$route.path
      };
    },
    jobId() {
      return this.$route.params.id.split('-').reverse()[0];
    }
  },
  methods: {
    parseLocation(location) {
      const result = new Set(location.split(',').map(i => i.trim()));
      return Array.from(result).join(', ');
    }
  }
}
</script>

<style scoped lang="scss">
.u-job-page {

  &__content {
  }

  &__navigate-back {
    display: block
  }
}
</style>
