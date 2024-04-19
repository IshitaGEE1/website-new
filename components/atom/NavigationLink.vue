<template>
  <contentful-page-link
    class="u-navigation-link"
    :url="url"
    :data-area="area"
    :data-main="main"
    v-if="isInternalPage"
  >
    {{ label }}
  </contentful-page-link>

  <base-link
    class="u-navigation-link"
    :url="url"
    :external="true"
    :data-area="area"
    :data-main="main"
    v-else
  >
    {{ label }}
  </base-link>
</template>

<script>
import BaseLink from '../_base/BaseLink';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';

export default {
  name: 'NavigationLink',
  components: { ContentfulPageLink, BaseLink },
  mixins: [ContentfulElementMixin],
  props: {
    footer: Boolean,
    main: Boolean,
    area: {
      type: String,
      default: 'header',
      validation: (val) => ['header', 'footer', 'actionBar'].includes(val)
    }
  },
  computed: {
    isInternalPage() {
      return Object.values(ContentTypes.pages).includes(this.sys?.contentType?.sys?.id);
    },
    url() {
      if (this.isInternalPage) {
        const data = this.fields;
        const subfolder = data?.urlSubfolder;
        const slug = data?.slug;
        return `${subfolder}${slug}`;
      }
      return this.fields?.url;
    },
    label() {
      return (this.fields?.title || this.fields?.label).trim();
    }
  }
}
</script>

<style scoped lang="scss">
.u-navigation-link {
  display: block;

  sup {
    font-size: .75rem;
  }

  &[data-area="header"] {
    font-size: 16px;
    line-height: inherit;
    color: var(--space-grey);
    text-decoration: none;

    @include navigation-collapse-above {
      white-space: nowrap;
    }

    &:hover {
      color: var(--pink);
    }
  }

  &[data-area="header"][data-main] {
    cursor: pointer;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--space-grey);

    @include navigation-collapse-below {
      justify-content: space-between;
    }

    &:hover {
      color: var(--blue);
    }
  }

  &[data-area="footer"] {
    color: #fff !important;
    font-size: 1rem;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    @include navigation-collapse-below {
      font-size: 16px;
      line-height: 1.3125rem;
    }

    @include navigation-collapse-above {
      font-size: 1rem;
      line-height: 2rem;
    }
  }

  &[data-area="actionBar"] {
    color: var(--blue);
    font-family: "Good Headline Pro", sans-serif;
    font-size: 20px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    sup {
      color: var(--blue);
    }
  }
}
</style>
