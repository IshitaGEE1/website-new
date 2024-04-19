<template>
  <base-page :header="header" :content="content" :footer="footer"/>
</template>

<script>
import BasePage from '../../../components/_base/BasePage';
import DynamicKeywordObservable from '../../../assets/js/mixins/DynamicKeywordObservable';
import FetchPageDataMixin, { fetchPageData } from '../../../assets/js/mixins/FetchPageDataMixin';
import ContentTypes from '../../../assets/js/enums/ContentTypes';

export default {
  name: 'PPC-Page',
  components: { BasePage },
  mixins: [FetchPageDataMixin, DynamicKeywordObservable],
  async asyncData(ctx) {
    return await fetchPageData(ctx, ctx.i18n.locale, ContentTypes.pages.ppc);
  },
}
</script>

<style scoped lang="scss">
.hide-content {
  visibility: hidden !important;
}
</style>
