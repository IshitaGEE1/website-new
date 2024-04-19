<template>
  <base-page :header="header" :content="content" :footer="footer"/>
</template>

<script>
import FetchPageDataMixin from '../assets/js/mixins/FetchPageDataMixin';
import BasePage from '../components/_base/BasePage';

export default {
  name: 'Index',
  components: { BasePage },
  mixins: [FetchPageDataMixin],
  provide: {
    isIndex: false
  }
}
</script>

<style scoped></style>
