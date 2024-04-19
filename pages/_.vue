<template>
  <base-page :header="header" :content="content" :footer="footer"/>
</template>

<script>
import FetchPageDataMixin from '../assets/js/mixins/FetchPageDataMixin';
import BasePage from '../components/_base/BasePage';

export default {
  name: 'Page',
  components: { BasePage },
  mixins: [FetchPageDataMixin],
  provide: {
    showBreadcrumb: true
  }
}
</script>

<style scoped></style>
