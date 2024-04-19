<template>
  <div class="u-language-switch" v-click-outside="() => expanded = false">
    <button class="u-language-switch__trigger" @click="expanded = !expanded">
      <span>{{ capitalizeFirstLetter(currentLanguage) }}</span>
      <template v-if="hasDifferentLanguages">
        <icon-caret :direction="expanded ? 'up' : 'down'"/>
      </template>
    </button>

    <div class="u-language-switch__options" v-show="expanded">
      <a
        :href="lang.url"
        class="u-language-switch__option"
        v-for="lang in languages"
        :key="`lang_${lang.code}`"
      >
        {{ lang.name }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconCaret from './IconCaret';
import InternalLinkService from '../../assets/js/services/internalLink.service';

export default {
  name: 'LanguageSwitch',
  components: { IconCaret },
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    ...mapState({
      urlByLocales: 'urlByLocales'
    }),
    currentLanguage() {
      return this.$i18n.locale;
    },
    languages() {
      let languages = this.urlByLocales.length > 0 ? this.urlByLocales.map(i => i.locale) : [];

      if (languages.length === 0) {
        return languages
      }
      const lang = languages.find(l => l.code === this.currentLanguage);
      languages.splice(languages.indexOf(lang), 1);
      languages.splice(0, 0, lang);
      return languages
        .map(l => ({
          ...l,
          url: this.generateLink(l)
        }));
    },
    hasDifferentLanguages() {
      return this.languages.length > 0;
    }
  },
  methods: {
    generateLink(lang) {
      const url = this.urlByLocales.find(i => i.locale.code === lang.code)?.url;
      return InternalLinkService.processLink(this.localePath({ path: url }, lang.code));
    },
    capitalizeFirstLetter(string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  }
}
</script>

<style scoped lang="scss">
.u-language-switch {
  position: relative;
  text-align: right;
  display: flex;
  justify-content: right;
  align-items: baseline;
  white-space: nowrap;

  &:hover &__trigger {
    color: var(--hover-color)
  }


  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.3125rem;
    white-space: nowrap;
    font-family: "Good Headline Pro", sans-serif;
    font-weight: 600;
    color: var(--space-grey);
    border: none;
    background: transparent;
    cursor: pointer;
  }

  &__options {
    color: var(--space-grey);
    text-align: left;
    position: absolute;
    top: 100%;
    right: calc(-18% - 0.25rem);
    padding-top: 20px;
    padding-bottom: 20px;
    background: #fff;
    box-shadow: -0.125rem 0.75rem 1.125rem 0 rgba(0, 0, 0, 0.25);
    white-space: nowrap;
    z-index: 1;
  }

  &__option {
    display: block;
    text-decoration: none;
    color: inherit;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1.3em;
    letter-spacing: 0.0005em;

    &:not(:first-child) {
      margin-top: 16px;
    }

    &:hover {
      color: var(--pink);
    }
  }
}
</style>
