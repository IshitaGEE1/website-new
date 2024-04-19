const SearchResultFactory = {
  create,
  createByDataObject
};

export default SearchResultFactory;

function create(url, title, description) {
  return {
    url,
    title,
    description
  };
}

function createByDataObject(data, lang, defaultLang) {
  return {
    url: `${data?.fields?.urlSubfolder[lang]}${data?.fields?.slug[lang]}`,
    title: data?.fields?.title[lang] || data?.fields?.title[defaultLang],
    description: (() => {
      try {
        return data?.fields?.seo[lang]?.fields?.description[lang] || data?.fields?.openGraphDescription[lang]
      } catch(ex) {
        return '';
      }
    })(),
    internal: true
  };
}
