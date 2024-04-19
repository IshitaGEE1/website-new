<template>
  <base-page class="u-search" :content="content" :footer="footer" :header="header">
    <template v-slot:pre-content>
      <section class="u-content-type u-content-type--module u-search">
        <div>
          <form class="u-search__bar" :action="searchUrl">
            <input type="text" name="s" v-model="searchQuery" minlength="3"/>
            <button type="submit">
              <base-image src="/icons/icon-search.svg" alt="Search icon" width="28" height="28"/>
            </button>
          </form>
        </div>

        <div>
          <div class="u-search__results">
            <search-result
              class="u-search__results-entry"
              v-for="(searchResult, index) in searchResults"
              :key="`searchResult_${index}`"
              v-bind="searchResult"
            />

            <base-loading-animation
              class="u-search__loading"
              width="32"
              height="32"
              v-if="processing"
            />

            <div class="u-search__no-results" v-if="!hasExistingResults">
              {{ $t('content.searchNoResults') }}
            </div>
          </div>

          <button class="u-button u-search__load-more" @click="loadNextPage" v-if="hasMoreItemsToLoad">
            {{ $t('controls.showMore') }}
          </button>
        </div>
      </section>
    </template>
  </base-page>
</template>

<script>
import { mapState } from 'vuex';
import { escape } from 'html-escaper';
import { createClient } from '../../plugins/contentful';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import SearchSettings from '../../assets/js/settings/SearchConstants.js';
import SearchResultFactory from '../../assets/js/services/searchresult.factory';
import FetchPageDataMixin from '../../assets/js/mixins/FetchPageDataMixin';
import BasePage from '../../components/_base/BasePage';
import ContentTypes from '../../assets/js/enums/ContentTypes';
import SearchResult from '../../components/molecule/SearchResult.vue';
import BaseLoadingAnimation from '../../components/_base/BaseLoadingAnimation.vue';
import BaseImage from '../../components/_base/BaseImage.vue';

const client = createClient();

export default {
  name: 'SearchPage',
  components: { BaseImage, BaseLoadingAnimation, SearchResult, BasePage },
  mixins: [FetchPageDataMixin],
  data() {
    return {
      processing: false,
      searchQuery: '',
      rawResults: [],
      searchResults: [],
      searchResultsIds: [],
      currentPageIndex: 0,
      maxPageIndex: 0
    }
  },
  computed: {
    ...mapState({
      predefinedSearch: 'predefinedSearch'
    }),
    hasExistingResults() {
      return !!this.searchResults.length;
    },
    hasMoreItemsToLoad() {
      if (this.processing) {
        return false;
      }
      return this.currentPageIndex < this.maxPageIndex;
    },
    searchUrl() {
      return InternalLinkService.processLink(this.localePath('/search'));
    }
  },
  mounted() {
    this.searchQuery = this.$route.query.s;

    if (!this.searchQuery) {
      return;
    }
    this.addManualSearchResults(this.searchQuery);
    this.searchRequest(escape(this.searchQuery));
  },
  methods: {
    addManualSearchResults(query) {
      const result = this.predefinedSearch.find(s => query.includes(s.searchTerm));
      if (result) {
        this.searchResults.push(SearchResultFactory.create(result.url, result.title, result.description));
      }
    },
    async searchRequest(query) {
      this.processing = true;
      await client.getEntries({
        'query': query,
        locale: '*',
        limit: SearchSettings.NUM_OF_ENTRIES_PER_PAGE,
        skip: this.currentPageIndex * SearchSettings.NUM_OF_ENTRIES_PER_PAGE
      }).then(async (response) => {
        this.maxPageIndex = Math.floor(response?.total / SearchSettings.NUM_OF_ENTRIES_PER_PAGE);
        const entries = response?.items;
        for (let entry of entries) {
          await this.evaluateEntry(entry);
        }
      }).finally(() => {
        this.processing = false;
      })
    },
    async evaluateEntry(entry) {
      if (this.isPageEntry(entry)) {
        this.rawResults.push(entry);

        if (this.isValidEntry(entry)) {
          this.addResultIfUnique(entry);
        }
      } else {
        await this.traverseToPage(entry);
      }
    },
    isPageEntry(entry) {
       return Object.values(ContentTypes.pages).includes(entry?.sys?.contentType?.sys?.id)
        && entry?.fields?.urlSubfolder && entry?.fields?.urlSubfolder[this.lang]
        && entry?.fields?.slug && entry?.fields?.slug[this.lang]
        && !['error', 'search'].includes(entry?.fields?.slug[this.lang].toLowerCase());
    },
    isValidEntry(entry) {
      const seoObject = entry?.fields?.seo;
      const no_index = seoObject['en']?.fields?.no_index;

      if (no_index) {
        return !no_index['en']
      }
      return true;
    },
    addResultIfUnique(pageEntry) {
      const pageId = pageEntry?.sys?.id;

      if (!!pageId && !this.searchResultsIds.includes(pageId)) {
        this.searchResultsIds.push(pageId);
        this.searchResults.push(SearchResultFactory.createByDataObject(pageEntry, this.lang, this.defaultLang));
        // this.rawResults.push(pageEntry);
      }
    },
    async traverseToPage(entry) {
      return await client.getEntries({
        links_to_entry: entry?.sys.id,
        limit: SearchSettings.LIMIT_LINKED_ENTRIES,
        locale: '*'
      }).then(async (nextEntries) => {
        for (let entry of nextEntries?.items) {
          await this.evaluateEntry(entry);
        }
      })
    },
    loadNextPage() {
      if (this.currentPageIndex === this.maxPageIndex) {
        return;
      }
      this.currentPageIndex++;
      this.searchRequest(escape(this.searchQuery))
    }
  }
}
</script>

<style scoped lang="scss">
.u-search {
  background-color: #fff;

  &__bar, &__results {
    background-color: white;
    padding: 1rem 1.5rem;
  }

  &__bar {
    position: relative;

    input[type=text] {
      border: 0.0625rem solid $color-productsup-dark-grey;
      padding: 0 0.3125rem;
      border-radius: 0;
      font-size: 2.5rem;
      width: 100%;
      outline: none;

      @include media-breakpoint-less-than($device-max-width-tablet) {
        font-size: 2rem;
      }
    }

    button {
      cursor: pointer;
      position: absolute;
      right: $gutter-size;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;

      &:hover {
        box-shadow: none;
      }
    }
  }

  &__results {
    margin-top: 1.5rem;

    &-entry + &-entry {
      margin-top: 3rem;
    }
  }

  &__loading {
    margin-top: 4rem;
    text-align: center;
  }

  &__load-more {
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-top: 1rem;
  }
}

//don't show search in header
::v-deep .u-navigation-search {
  display: none;
}
</style>
