<template>
  <details class="u-faq-item">
    <script type="application/ld+json" v-html="jsonLd"></script>

    <summary class="u-faq-item__question">{{ question }}</summary>
    <markdown-text class="u-faq-item__answer" :text="answer"></markdown-text>
  </details>
</template>

<script>
import MarkdownText from '../atom/MarkdownText.vue';
import ContentModule from '../_base/ContentModule.vue';
import showdown from 'showdown';
const converter = new showdown.Converter();

export default {
  name: 'FaqItem',
  components: { ContentModule, MarkdownText },
  props: {
    question: String,
    answer: String
  },
  computed: {
    jsonLd() {
      return `{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": {
          "@type": "Question",
          "name": ${this.question},
          "acceptedAnswer": {
            "@type": "Answer",
            "text": ${converter.makeHtml(this.answer)}
          }
        }
      }`
    }
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-faq-item {
  --spacing-width: 1.75rem;

  padding-top: var(--spacing-width);
  padding-bottom: var(--spacing-width);

  &__question {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    gap: 1rem;
    color: var(--text-color);
    font-family: "Good Headline Pro", sans-serif;
    font-size: 1.75rem;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 1.2;
    cursor: pointer;

    &::before {
      content: '';
      width: 1rem;
      height: 1rem;
      background-image: url('/icons/chevron-down.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }

  &__answer {
    margin-top: var(--spacing-width);
    padding-inline-start: 2rem;

    :deep(p) {
      margin: unset;
    }
  }

  &[open] > &__question::before {
    background-image: url('/icons/chevron-up.svg');
  }

  &[open] summary ~ * {
    animation: sweep .5s ease-in-out;
  }
}
</style>
