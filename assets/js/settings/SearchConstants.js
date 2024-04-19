//these constants are settings for the search module
const SearchSettings = {
  //search guarantees to return at least that many results before
  //user has to load more himself
  NUM_OF_RESULTS_GUARANTEED: 10,
  //this is the pagination limit for the initial full-text-search
  NUM_OF_ENTRIES_PER_PAGE: 10,
  //use phrase search -> more restrictive
  PHRASE_SEARCH_ENABLED: false,
  //configure how many pages are shown that link to the same entry
  LIMIT_LINKED_ENTRIES: 1
}

export default SearchSettings;
