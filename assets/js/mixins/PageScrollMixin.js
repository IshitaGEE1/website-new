export default {
  inject: {
    isIndex: {
      from: 'isIndex',
      default: false
    }
  },
  data() {
    return {
      scrollTop: 0
    }
  },
  computed: {
    scrolled() {
      return this.scrollTop > 0;
    }
  },
  mounted() {
    document.addEventListener('scroll', (e) => {
      this.scrollTop = document.documentElement.scrollTop;
    })
  }
}
