<template>
  <div class="u-author">
    <contentful-image
      class="u-author__image-wrapper"
      v-bind="image"
      width="64"
      height="64"
      v-if="image"
    />

    <div class="u-author__information">
      <base-headline tag="h4" class="u-author__name" v-if="name">{{ name }}</base-headline>
      <div class="u-author__role" v-if="role">{{ role }}</div>
    </div>
  </div>
</template>

<script>
import BaseImage from '../_base/BaseImage.vue'
import ContentfulImage from '../_contentful/ContentfulImage';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import BaseHeadline from "../_base/BaseHeadline";

export default {
  name: 'Author',
  mixins: [ContentfulElementMixin],
  components: {BaseHeadline, ContentfulImage, BaseImage },
  computed: {
    image() {
      return this.fields?.profilPicture;
    },
    name() {
      return this.fields?.name;
    },
    role() {
      return this.fields?.role;
    }
  }
}
</script>

<style scoped lang="scss">
.u-author {
  display: flex;
  align-items: center;

  & > * {
    &:not(:first-child) {
      margin-left: 0.625rem;
    }
  }

  &__image-wrapper {
    border-radius: 50%;
    overflow: hidden;
    min-width: 4rem;
  }

  &__name {
    margin-top: 0;
    margin-bottom: 0.1875rem;
  }

  &__role {
    font-size: 0.875rem;
    color: #a7adba;
  }
}
</style>
