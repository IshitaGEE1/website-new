export default {
  beforeMount() {
    this.$store.commit('setKeywords', this.$route.query);
  },
}
