<template>
  <footer class="u-content-type u-content-type--footer u-landing-page-footer">
    <div class="u-landing-page-footer__body">
      <contentful-image
        class="u-landing-page-footer__image-wrapper"
        v-bind="companyLogo"
        width="160"
        height="90"
        lazy
        v-if="companyLogo"
      />

      <markdown-text :text="text" class="u-paragraph u-landing-page-footer__text" v-if="text"/>

      <span class="u-small-text u-landing-page-footer__copyright" v-if="copyright">{{ copyright }}</span>

      <ul class="u-landing-page-footer__links" v-if="links">
        <li v-for="(item, index) in links" :key="`link_${index}`" class="u-landing-page-footer__link-wrapper">
          <base-link class="u-landing-page-footer__link" :url="item.url" :label="item.label" external/>
        </li>
      </ul>

      <scroll-top-button></scroll-top-button>
    </div>
  </footer>
</template>

<script>
import ContentfulModuleMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import ScrollTopButton from '../atom/ScrollTopButton';
import BaseImage from '../_base/BaseImage';
import MarkdownText from '../atom/MarkdownText';
import ContentfulImage from '../_contentful/ContentfulImage';
import BaseLink from '../_base/BaseLink';

export default {
  name: 'LandingPageFooter',
  components: { BaseLink, ContentfulImage, MarkdownText, BaseImage, ScrollTopButton },
  mixins: [ContentfulModuleMixin],
  computed: {
    companyLogo() {
      return this.fields?.logo;
    },
    text() {
      return this.fields?.text;
    },
    copyright() {
      return this.fields?.copyright;
    },
    links() {
      let links = this.fields.links;
      return links ? links?.map(i => i.fields) : [];
    }
  },
}
</script>

<style scoped lang="scss">
.u-landing-page-footer {
  padding-top: 4.6875rem;
  padding-bottom: unset;
  margin-bottom: var(--height-sticky);

  &__body {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  &__text {
    text-align: center;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;

    @include media-breakpoint-up($device-min-width-tablet) {
      max-width: 80%;
    }

    @include media-breakpoint-up($device-min-width-desktop) {
      max-width: 64rem;
    }
  }

  &__links {
    display: flex;
    flex-flow: row;
    justify-content: center;
    list-style: none;
    margin: 0.625rem auto 3.75rem auto;
    padding: unset;
  }

  &__link-wrapper {
    color: #4F5B66;
    font-size: 1.125rem;
    letter-spacing: 0;
    line-height: 1.3em;

    & + & {
      position: relative;
      margin-left: 1em;
      border-left: 0.0625rem solid grey;
      padding-left: 1em;
    }
  }

  &__link {
    text-decoration: none;
  }
}
</style>
