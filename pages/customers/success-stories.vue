<template>
  <base-page :header="header" :content="content" :footer="footer"/>
</template>

<script>
import FetchPageDataMixin from '../../assets/js/mixins/FetchPageDataMixin';
import BasePage from '../../components/_base/BasePage';

export default {
  name: 'CustomerOverview',
  components: { BasePage },
  mixins: [FetchPageDataMixin],
  nuxtI18n: {
    paths: {
      en: '/customers/success-stories/',
      de: '/kunden/erfolgsgeschichten/',
      fr: '/clients/success-stories/',
      it: '/clienti/storie-di-successo/',
      es: '/clientes/casos-de-exito-de-clientes/'
    }
  }
}
</script>

<style scoped></style>
