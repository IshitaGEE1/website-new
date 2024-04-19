<template>
  <div class="u-bio-card">
    <base-link
      class="u-bio-card__head"
      :class="{ 'u-bio-card__head--clickable': linkedinProfile}"
      :url="linkedinProfile"
      external
    >
      <contentful-image
        class="u-bio-card__image-wrapper"
        v-bind="image"
        :width="480"
        :height="270"
        lazy
        :fit="fitOption"
        v-if="image"
      />

      <svg
        height="2500"
        width="2490"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        class="u-bio-card__linkedin-logo"
        v-if="linkedinProfile"
      >
        <g fill="none">
          <path
            d="M0 18.338C0 8.216 8.474 0 18.92 0h218.16C247.53 0 256 8.216 256 18.338v219.327C256 247.79 247.53 256 237.08 256H18.92C8.475 256 0 247.791 0 237.668V18.335z"
            fill="#069"/>
          <path
            d="M77.796 214.238V98.986H39.488v115.252H77.8zM58.65 83.253c13.356 0 21.671-8.85 21.671-19.91-.25-11.312-8.315-19.915-21.417-19.915-13.111 0-21.674 8.603-21.674 19.914 0 11.06 8.312 19.91 21.169 19.91h.248zM99 214.238h38.305v-64.355c0-3.44.25-6.889 1.262-9.346 2.768-6.885 9.071-14.012 19.656-14.012 13.858 0 19.405 10.568 19.405 26.063v61.65h38.304v-66.082c0-35.399-18.896-51.872-44.099-51.872-20.663 0-29.738 11.549-34.78 19.415h.255V98.99H99.002c.5 10.812-.003 115.252-.003 115.252z"
            fill="#fff"/>
        </g>
      </svg>
    </base-link>

    <div class="u-bio-card__body">
      <base-headline tag="h3" center class="u-bio-card__speaker-name" v-if="speakerName">
        {{ speakerName }}
      </base-headline>

      <div class="u-bio-card__speaker-title" v-if="speakerTitle">
        {{ speakerTitle }}
      </div>

      <div class="u-bio-card__company-name" v-if="companyName">
        {{ companyName }}
      </div>

      <markdown-text :text="description" class="u-bio-card__description" v-if="description"/>
    </div>
  </div>
</template>

<script>
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import ContentfulImage, { FitOptions } from '../_contentful/ContentfulImage';
import MarkdownText from '../atom/MarkdownText';
import BaseImage from '../_base/BaseImage';
import BaseLink from '../_base/BaseLink';
import BaseHeadline from '../_base/BaseHeadline';

export default {
  name: 'BioCard',
  mixins: [ContentfulElementMixin],
  components: { BaseHeadline, BaseLink, ContentfulImage, MarkdownText, BaseImage },
  data() {
    return {
      fitOption: FitOptions.PAD
    }
  },
  computed: {
    image() {
      return this.fields?.image;
    },
    linkedinProfile() {
      return this.fields?.linkedinProfile;
    },
    speakerName() {
      return this.fields?.speakerName;
    },
    speakerTitle() {
      return this.fields?.speakerTitle;
    },
    companyName() {
      return this.fields?.companyName;
    },
    description() {
      return this.fields?.description;
    }
  }
}
</script>


<style scoped lang="scss">
.u-bio-card {
  overflow: hidden;
  height: 100%;
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  @include set-box-shadow;
  padding: 1.5rem;
  background-color: #fff;

  &__head {
    position: relative;

    &--clickable {
      cursor: pointer;
    }
  }

  &__linkedin-logo {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    bottom: 0;
    left: 50%;
    transform: translate(100%, -50%);
  }

  &__image-wrapper {
    margin-bottom: 1.25rem;
  }

  &__body {
    display: flex;
    flex-flow: column nowrap;
    flex: 2;
  }

  &__speaker-name {
    flex: 1;
    margin-bottom: .25rem;
  }

  &__speaker-title {
    margin-top: .25rem;
    color: rgba(0, 0, 0, .65);
  }

  &__company-name {
    margin-top: 1rem;
  }

  &__description {
    flex: 2;
    margin-top: 1rem;

    ::v-deep p {
      margin-top: unset;

      &:last-child {
        margin-bottom: unset;
      }
    }
  }
}
</style>
