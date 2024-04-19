const store = {
  state: () => ({
    urlByLocales: [],
    queryParameter: undefined,
    navigationPaths: new Map([
      ['/', ['Home']],
      ['/de/', ['Home']],
      ['/fr/', ['Home']],
      ['/it/', ['Home']],
      ['/es/', ['Home']]
    ]),
    predefinedSearch: [{
      searchTerm: 'academy',
      url: 'https://academy.productsup.com/',
      title: 'Productsup Academy - Your learning center for product feed management',
      description: ''
    }, {
      searchTerm: 'help',
      url: 'https://help.productsup.com/',
      title: 'Productsup Help Center: user documentation',
      description: ''
    }],
    keywords: undefined
  }),
  getters: {
    categoryFilter: (state) => state?.queryParameter?.category,
    keywordKw: (state) => state?.keywords?.kw,
    keywordChannel: (state) => state?.keywords?.channel,
    keywordSocial: (state) => state?.keywords?.social
  },
  mutations: {
    setUrlByLocales(state, urlByLocales = []) {
      state.urlByLocales = urlByLocales;
    },
    setQueryParameter(state, queryParameter = undefined) {
      state.queryParameter = queryParameter;
    },
    setNavigationPaths(state, navigationPath) {
      if (!navigationPath) {
        return;
      }
      state.navigationPaths.set(navigationPath.url, navigationPath.value);
    },
    setKeywords(state, keywords = undefined) {
      state.keywords = keywords;
    }
  },
  actions: {},
  modules: {}
};

export default store;
