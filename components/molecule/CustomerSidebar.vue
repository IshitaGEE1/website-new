<template>
  <aside class="u-customer-sidebar">
    <contentful-image
      class="u-customer-sidebar__customer-logo"
      v-bind="customerLogo"
      v-if="customerLogo"
    />

    <div class="u-customer-sidebar__profile-box" v-if="profile || homepage">
      <markdown-text class="u-customer-sidebar__profile-text" :text="profile" v-if="profile"/>

      <base-cta
        :url="homepageUrl"
        external
        block
        v-if="homepage"
      >
        {{ homepageLabel }}
      </base-cta>
    </div>

    <div class="u-customer-sidebar__about" v-if="about || action">
      <markdown-text :text="about" v-if="about"/>

      <div class="u-customer-sidebar__button-wrapper">
        <component
          class="u-customer-sidebar__action"
          :is="actionType"
          v-bind="action"
          v-if="action && actionType"
        />
      </div>
    </div>
  </aside>
</template>

<script>
import MarkdownText from '../atom/MarkdownText';
import BaseImage from '../_base/BaseImage';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import BaseLink from '../_base/BaseLink';
import BaseCta from '../_base/BaseCta.vue';

export default {
  name: 'CustomerSidebar',
  components: { BaseCta, BaseLink, ContentfulImage, BaseImage, MarkdownText },
  mixins: [ContentfulElementMixin],
  computed: {
    profile() {
      return this.fields?.profile;
    },
    about() {
      return this.fields?.about;
    },
    homepage() {
      return this.fields?.homepage?.fields;
    },
    homepageUrl() {
      return this.homepage?.url;
    },
    homepageLabel() {
      return this.homepage?.label;
    },
    customerLogo() {
      return this.fields?.customerLogo;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.fields?.action?.sys?.contentType?.sys?.id;
    }
  }
}
</script>

<style scoped lang="scss">
.u-customer-sidebar {
  display: flex;
  flex-flow: column nowrap;

  @include media-breakpoint-up($device-min-width-tablet) {
    width: calc(100% / 3);
  }

  > * {
    background-color: #fff;
    padding: 2rem;

    &:not(:first-child) {
      margin-top: $gutter-size;
    }
  }

  &__story,
  &__profile-box,
  &__about {
    ::v-deep * {
      &:first-child {
        margin-top: unset;
      }
    }
  }

  &__button-wrapper {
    text-align: center;
    margin-top: 1.875rem;
  }
}
</style>
