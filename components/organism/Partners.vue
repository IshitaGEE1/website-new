<template>
  <section
    :class="['u-content-type u-content-type--module u-partners', theme]"
    v-bind="backgroundAttributes"
    :style="backgroundStyles"
  >
    <base-headline tag="h2" center class="u-partners__headline" :text="headline" v-if="headline">
      {{ headline }}
    </base-headline>

    <div class="u-partners__badges" v-if="badges">
      <base-link
        class="u-partners__badge"
        v-for="(badge, index) in badges"
        :key="`badge_${index}_${badge.name}`"
        v-bind="badge.link"
      >
        <contentful-image v-bind="badge.image" width="128" height="64" lazy/>
      </base-link>
    </div>

    <markdown-text class="u-paragraph u-partners__paragraph" :text="text" v-if="text"></markdown-text>

    <div class="u-partners__footer">
      <component class="u-page-banner__button" :is="actionType" v-bind="action" v-if="action"/>
    </div>
  </section>
</template>

<script>
import ContentfulOrganismMixin from '../../assets/js/mixins/ContentfulModuleMixin';
import BaseImage from '../_base/BaseImage';
import MarkdownText from '../atom/MarkdownText';
import BackgroundMixin from '../../assets/js/mixins/BackgroundMixin';
import ContentfulImage from '../_contentful/ContentfulImage';
import BaseHeadline from '../_base/BaseHeadline';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import BaseLink from '../_base/BaseLink';

export default {
  name: 'Partners',
  components: { BaseLink, BaseHeadline, ContentfulImage, MarkdownText, BaseImage },
  mixins: [ContentfulOrganismMixin, BackgroundMixin],
  computed: {
    headline() {
      return this.fields?.headline;
    },
    text() {
      return this.fields?.text;
    },
    action() {
      return this.fields?.action;
    },
    actionType() {
      return this.action?.sys?.contentType?.sys?.id;
    },
    badges() {
      return this.fields?.badges?.map(i => {
        return {
          image: i.fields.image,
          link: ((linkRef) => {
            if (!linkRef?.sys?.contentType?.sys?.id) {
              return;
            }

            if (linkRef.sys.contentType.sys.id === ContentTypes.elements.externalLink) {
              return {
                ...linkRef.fields,
                external: true
              };
            }
            return {
              name: linkRef.fields.name,
              url: InternalLinkService.processLink(linkRef.fields.urlSubfolder + linkRef.fields.slug),
              external: false
            };
          })(i.fields.link)
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.u-partners {
  &__body,
  &__footer {
    text-align: center;
  }

  &__headline {
    margin-bottom: 1.25rem;

    @include media-breakpoint-up($device-min-width-tablet) {
      margin-bottom: 2.5rem;
    }

    @include media-breakpoint-up($device-min-width-desktop) {
      margin-bottom: 6.25rem;
    }
  }

  &__paragraph {
    margin-top: 1.25rem;
    margin-bottom: 0;

    @include media-breakpoint-up($device-min-width-tablet) {
      margin-top: 2.5rem;
    }

    @include media-breakpoint-up($device-min-width-desktop) {
      margin-top: 6.25rem;
    }
  }

  &__button {
    @include media-breakpoint-up($device-min-width-tablet) {
      margin-top: 2.5rem;
    }
  }

  &__badges {
    display: flex;
    flex-flow: row wrap;
    gap: 2rem;
    align-items: center;
    justify-content: center;

    @include tablet-above {
      gap: 2rem 3rem;
    }

    @include desktop {
      gap: 2rem 5rem;
    }
  }
}

</style>
