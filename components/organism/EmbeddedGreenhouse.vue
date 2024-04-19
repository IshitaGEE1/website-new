<template>
  <div class="u-content-type u-content-type--module u-embedded-greenhouse">
    <div id="grnhse_app"></div>
  </div>
</template>

<script>
export default {
  name: 'EmbeddedGreenhouse',
  props: {
    jobId: [String, Number]
  },
  mounted() {
    //start greenhouse
    Grnhse.Iframe.load(this.jobId);
  }
}
</script>

<style scoped lang="scss">
:not(.u-content-type--banner) + .u-content-type--module {
  padding: unset;
}
</style>
