<template>
  <footer class="u-page-footer">
    <div class="u-page-footer__header">
      <p class="u-page-footer__slogan">{{ slogan }}</p>
      <contentful-image
        class="u-page-footer__logo-wrapper"
        v-bind="logo"
        width="192"
        height="48"
        lazy
        v-if="logo"
      />
    </div>

    <nav class="u-page-footer__body">
      <footer-navigation-section
        class="u-page-footer__section"
        v-for="(section, index) in navigationSections"
        :key="`footer_section_${index}`"
        v-bind="section"
      />
    </nav>

    <div class="u-page-footer__footer">
      <div class="u-page-footer__sm-channels">
        <base-link
          v-for="(item, index) in socialMedia"
          :key="`social_media_${index}`"
          :url="item.url"
          external
        >
          <img
            class="u-page-footer__sm-logo"
            :src="item.logo"
            :alt="item.name"
            width="24"
            height="24"
            loading="lazy"
          />
        </base-link>
      </div>

      <div class="u-page-footer__internals">
        <nav class="u-page-footer__legal-links">
          <base-link
            class="u-page-footer__main-link"
            v-for="(item, index) in links"
            :key="`link_${index}`"
            v-bind="item"
          />
        </nav>

        <div class="u-small-text u-page-footer__copyright">
          {{ copyright }}
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import ContentfulOrganismMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import BaseLink from '../_base/BaseLink';
import FooterNavigationSection from '../molecule/FooterNavigationSection.vue';
import ContentTypes from '../../assets/js/enums/ContentTypes';

export default {
  name: 'PageFooter',
  components: {
    FooterNavigationSection,
    BaseLink,
    ContentfulImage
  },
  mixins: [ContentfulOrganismMixin],
  computed: {
    slogan() {
      return this.fields?.slogan;
    },
    logo() {
      return this.fields?.logo;
    },
    navigationSections() {
      return this.fields?.navigation.map(i => {
        return {
          title: i.fields.label,
          items: i.fields.elements?.map(j => {
            return {
              url: j.fields?.url || j.fields?.urlSubfolder + j.fields?.slug,
              label: j.fields?.label || j.fields?.title,
              external: j.sys?.contentType?.sys?.id === ContentTypes.elements.link
            }
          })
        }
      });
    },
    socialMedia() {
      return this.fields?.socialMediaButtons.map(i => {
        return {
          url: i.fields?.url,
          logo: i.fields?.image?.fields?.file?.url,
          name: i.fields?.name
        }
      });
    },
    text() {
      return this.fields?.text;
    },
    copyright() {
      return this.fields?.copyright;
    },
    links() {
      let legalLinks = this.fields?.legalLinks;
      return legalLinks ? legalLinks.map((i) => i.fields) : [];
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.u-page-footer {
  &__header,
  &__body,
  &__footer {
    @include set-module-width;
  }

  &__header {
    max-width: 70vw;
  }

  &__slogan,
  &__logo-wrapper {
    margin: unset;
    grid-column-start: 5;
    grid-column-end: span 4;
  }

  &__slogan {
    color: var(--blue-darkest);
    font-family: "Nunito", sans-serif;
    font-size: 1.0625rem;
    line-height: 2.25rem;
    letter-spacing: 0;
    text-align: center;
  }

  &__body {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }

  &__sm-channels,
  &__legal-links {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__legal-links > * {
    color: var(--blue-darkest);
    font-family: "Nunito", sans-serif;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0;
    text-decoration: none;
  }

  @include tablet-below {
    background: linear-gradient(180deg, #FFF 0%, var(--blue-low-sat) 100%);

    &__header {
      padding-top: 3.125rem;
      padding-bottom: 3.125rem;
    }

    &__section {
      padding-top: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    &__footer {
      display: grid;
      grid-template: auto auto auto / auto;
      gap: 1.5rem;
      padding-top: 3rem;
      padding-bottom: 2rem;
    }

    &__internals {
      display: contents;
    }
  }

  @include desktop {
    background: linear-gradient(0deg, #FFF 0%, transparent 100%), linear-gradient(333.86deg, var(--blue) 10%, #FFF 80%);
    padding-top: 5.625rem;
    padding-bottom: 3.75rem;

    &__header,
    &__footer {
      display: grid;
      grid-template: auto / repeat(12, 1fr);
      column-gap: 2rem;
    }

    &__body {
      display: grid;
      grid-template: auto / repeat(auto-fit, minmax(140px, 1fr));
      column-gap: 3%;
      margin-top: 3.75rem;
      padding-top: 3.75rem;
      padding-bottom: 3.75rem;
    }

    &__internals,
    &__sm-channels {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    &__internals {
      grid-column-end: span 8;
      order: -1;
    }

    &__copyright {
      order: -1;
    }

    &__sm-channels {
      grid-column-end: span 4;
      justify-self: flex-end;
    }

    &__sm-logo {
      width: 2rem;
      height: 2rem;

      &:hover {
        transform: scale(1.2);
        transition: transform .3s;
      }
    }
  }
}
</style>
