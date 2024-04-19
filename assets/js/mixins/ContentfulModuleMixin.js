export default {
  props: {
    fields: Object,
    metadata: Object,
    sys: Object,
    contentType: String,
  },
  computed: {
    data() {
      return {
        fields: this.fields,
        metadata: this.metadata,
        sys: this.sys
      }
    }
  }
}
