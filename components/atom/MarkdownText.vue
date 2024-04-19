<template>
  <div :class="['u-markdown', { 'u-markdown--centered': center}]" v-html="convertedText"></div>
</template>

<script>
import showdown from 'showdown';
const converter = new showdown.Converter();

export default {
  name: 'MarkdownText',
  props: {
    text: String,
    center: {
      type: Boolean,
      default: false
    },
    imageScaling: {
      type: Number,
      default: 1200
    }
  },
  computed: {
    convertedText() {
      return converter.makeHtml(this.text);
    }
  },
  mounted() {
    this.updateLists();
    this.updateImageSources();
    this.updateExternalLinks();
  },
  methods: {
    updateLists() {
      Array.from(this.$el.querySelectorAll('ul')).forEach(i => {
        i.classList.add('u-base-list')
      });
    },
    updateExternalLinks() {
      Array.from(this.$el.querySelectorAll('a')).forEach(i => {
        if (!i.href.startsWith('https://www.productsup.com/')) {
          i.target = '_blank';
          i.rel = 'noopener noreferrer';
        }
      })
    },
    updateImageSources() {
      Array.from(this.$el.querySelectorAll('img')).forEach(i => {
        const indexOfQuestionmark = i.src.indexOf('?');

        if(indexOfQuestionmark === -1) {
          i.src += `?fm=webp&w=${this.imageScaling}`;
          return;
        }
        const hasFmParameter = i.src.substr(indexOfQuestionmark).indexOf('fm') > -1;
        const hasWidthParamter = i.src.substr(indexOfQuestionmark).indexOf('w') > -1;

        if(!hasFmParameter) {
          i.src += '&fm=webp';
        }
        if(!hasWidthParamter) {
          i.src += '&w=700';
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.u-markdown {
  &--centered {
    text-align: center;
  }

  ::v-deep ul,
  ::v-deep ol {
    @extend %list;

    * + & {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  ::v-deep img,
  ::v-deep video,
  ::v-deep iframe {
    max-width: 100%;
  }

  ::v-deep * + h2,
  ::v-deep * + h3 {
    margin-top: 2.5rem;
  }
}
</style>
