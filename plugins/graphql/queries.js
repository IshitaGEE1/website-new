const FRAGMENTS = /* GraphQL */`
  fragment PageRefFields on Entry {
    ... on ArticlePage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on CompanyNewsPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on CorePage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on CustomerPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on EventPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on GlossaryCategoryPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on GlossaryListingGroupPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on GlossaryPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on GlossaryTermPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on PartnerPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
    ... on LandingPage {
      sys { id }
      urlSubfolder
      slug
      title
    }
  }
`;


const BlogPostsByCategory = /* GraphQL */`
  query BlogPostsByCategory($categoryName: String, $amount: Int, $locale: String, $preview: Boolean) {
    articlePageCollection(preview: $preview, limit: $amount, where: {
      category: {
        name: $categoryName
      }
    }, order: [published_DESC]) {
      items {
        sys {
          id
        }
        title(locale: $locale)
        urlSubfolder(locale: $locale)
        slug(locale: $locale)
      }
    }
  }
`

const AllBlogPosts = /* GraphQL */`
  query AllBlogPosts($locale: String, $amount: Int, $skip: Int, $preview: Boolean) {
    articlePageCollection(preview: $preview, limit: $amount, locale: $locale, skip: $skip, order: [published_DESC]) {
      items {
        urlSubfolder
        slug
        contentType: __typename
        headline
        published
        name
        category {
          label
        }
        tags: tagsCollection(limit: 15) {
          items {
            slug
          }
        }
        image {
          url
        }
      }
    }
  }
`;

const Header = /* GraphQL */`${FRAGMENTS}
  query Header($locale: String, $preview: Boolean, $headerId: String!) {
    modulePageHeader(id: $headerId, locale: $locale, preview: $preview) {
      name
      logo {
        url
        height
        width
      }
      navigationMenu {
        name
        elementsCollection (limit: 10) {
          items {
            typeName: __typename
            ...NavEntry
            ... on ElementNavigationSection {
              label
              elementsCollection (limit: 10) {
                items {
                  typeName: __typename
                  ...NavEntry
                  ... on ElementNavigationSection {
                    label
                    elementsCollection (limit: 10) {
                      items {
                        typeName: __typename
                        ...NavEntry
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment NavEntry on Entry {
    ...PageRefFields
    ... on ElementLink {
      ...ElementLinkFields
    }
  }

  fragment ElementLinkFields on ElementLink {
    label
    image {
      width
      height
      url
    }
    url
  }
`;

const Footer = /* GraphQL */`${FRAGMENTS}
  query Header($locale: String, $preview: Boolean, $footerId: String!) {
    modulePageFooter(preview: $preview, locale: $locale, id: $footerId) {
      name
      logo {
        url
        width
        height
      }
      copyright
      copyrightText
      legalLinksCollection {
        items {
          typeName: __typename
          ...ElementLinkFields
        }
      }
      signUpHeadline
      signUpText
      hubspotFormId
      navigationMenu {
        name
        elementsCollection (limit: 10) {
          items {
            typeName: __typename
            ...NavEntry
            ... on ElementNavigationSection {
              label
              elementsCollection (limit: 10) {
                items {
                  typeName: __typename
                  ...NavEntry
                  ... on ElementNavigationSection {
                    label
                    elementsCollection (limit: 10) {
                      items {
                        typeName: __typename
                        ...NavEntry
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fragment NavEntry on Entry {
    ...PageRefFields
    ... on ElementLink {
      ...ElementLinkFields
    }
  }

  fragment ElementLinkFields on ElementLink {
    label
    image {
      width
      height
      url
    }
    url
  }
`;

const GlossaryPages = /* GraphQL */`
  query GlossaryPages($locale: String, $preview: Boolean) {
    glossaryTermPageCollection(preview: $preview, locale: $locale) {
      items {
        headline
        urlSubfolder
        slug
      }
    }
  }
`;

const BlogPostAmount = /* GraphQL */`
  query BlogPostAmount($locale: String, $preview: Boolean) {
    articlePageCollection(preview: $preview, locale: $locale) {
      total
    }
  }
`;

const GlossaryPagesByCategoryId = /* GraphQL */`
  query GlossaryPages($locale: String, $categoryId: String, $preview: Boolean) {
    glossaryTermPageCollection(preview: $preview, locale: $locale, where: { assignedCategory: { sys: { id: $categoryId } } }) {
      items {
        headline
        urlSubfolder
        slug
      }
    }
  }
`;

const AllGlossaryPages = /* GraphQL */`
  query GlossaryPages($locale: String, $preview: Boolean) {
    glossaryTermPageCollection(preview: $preview, locale: $locale, limit: 1000) {
      items {
        headline
        urlSubfolder
        slug
      }
    }
  }
`;

const GlossaryListGroups = /* GraphQL */`
  query GlossaryListGroups($locale: String, $preview: Boolean) {
    glossaryListingGroupPageCollection(preview: $preview, locale: $locale, limit: 1000) {
      items {
        urlSubfolder
        slug
      }
    }
  }
`;

const LatestBlogPostTeasersByCategory = /* GraphQL */`
  query LatestBlogPostTeasersByCategory($locale: String, $preview: Boolean, $category: String, $amount: Int = 3) {
    articlePageCollection(preview: $preview, locale: $locale, where: { category: { name: $category } }, order: [published_DESC], limit: $amount) {
      items {
        typeName: __typename
        sys {
          id
        }
        image {
          title
          url
        }
        tags: tagsCollection (limit: 5) {
          items {
            name
            label
            slug
          }
        }
        category {
          name
          label
          slug
        }
        headline
        published
        urlSubfolder
        slug
      }
    }
  }
`;

const BlogPostTeasers = /* GraphQL */`
  query BlogPostTeasers($locale: String, $preview: Boolean, $limit: Int = 1000) {
    articlePageCollection(preview: $preview, locale: $locale, order: [published_DESC], limit: $limit) {
      total
      items {
        typeName: __typename
        sys {
          id
        }
        image {
          title
          url
        }
        tags: tagsCollection (limit: 5) {
          items {
            name
            label
            slug
          }
        }
        category {
          name
          label
          slug
        }
        headline
        published
        urlSubfolder
        slug
      }
    }
  }
`;

const CustomerTeasers = /* GraphQL */`
  query CustomerTeasers($locale: String, $preview: Boolean, $limit: Int = 1000) {
    customerPageCollection(preview: $preview, locale: $locale, limit: $limit, order: [slug_ASC]) {
      items {
        typeName: __typename
        sys {
          id
        }
        urlSubfolder
        slug
        customerLogo {
          title
          url
        }
        category: categoriesCollection (limit: 1) {
          items {
            name
            label
            slug
          }
        }
        teaserText
        headline
        teaserCtaLabel
        videoUrl
      }
    }
  }
`;

const EventTeasers = /* GraphQL */`
  query EventTeasers($locale: String, $preview: Boolean, $limit: Int = 1000) {
    eventPageCollection(preview: $preview, locale: $locale, limit: $limit, order: [date_DESC]) {
      items {
        typeName: __typename
        sys {
          id
        }
        urlSubfolder
        slug
        teaserImage {
          title
          url
        }
        date
        headline
        teaserText
      }
    }
  }
`;

const PartnerTeasers = /* GraphQL */`
  query PartnerTeasers($locale: String, $preview: Boolean, $limit: Int = 1000) {
    partnerPageCollection(preview: $preview, locale: $locale, limit: $limit, order: [name_ASC]) {
      items {
        typeName: __typename
        sys {
          id
        }
        urlSubfolder
        slug
        logo {
          title
          url
        }
        category: categoriesCollection (limit: 1) {
          items {
            name
            label
            slug
          }
        }
      }
    }
  }
`;

const ChannelOverviewPages =  /* GraphQL */`
  query ChannelOverviewPages($locale: String, $preview: Boolean, $limit: Int, $skip: Int) {
    channelOverviewPageCollection(locale: $locale, preview: $preview, limit: $limit, skip: $skip, order: [sys_firstPublishedAt_ASC]) {
      total
      items {
        title
        urlSubfolder
        slug
      }
    }
  }
`;

const SupportedChannels =  /* GraphQL */`
  query SupportedChannels($locale: String, $preview: Boolean, $limit: Int, $skip: Int, $top: Boolean) {
    supportedChannelCollection(locale: $locale, preview: $preview, limit: $limit, skip: $skip, where: { topChannel: $top}, order: [name_ASC]) {
      total
      items {
        name
        categoriesCollection (limit: 20) {
          items {
            name
          }
        }
        linkedFrom {
          channelPageCollection(limit: 1) {
            items {
              title
              slug
            }
          }
        }
      }
    }
  }
`;

const ExportChannels =  /* GraphQL */`
  query ExportChannels($locale: String, $preview: Boolean, $limit: Int, $name: String) {
    exportChannelCollection(preview: $preview, locale: $locale, limit: $limit, where: { name: $name}, order: [name_ASC]) {
      total
      items {
        name
        linkedFrom {
          supportedChannelCollection(limit: 1) {
            items {
              name
              linkedFrom {
                channelPageCollection(limit: 1) {
                  items {
                    urlSubfolder
                    slug
                  }
                }
              }
            }
          }
          channelPageCollection(limit: 1) {
            items {
              title
              slug
            }
          }
        }
      }
    }
  }
`;

const ChannelCategories =  /* GraphQL */`
  query ChannelCategories($locale: String, $preview: Boolean, $limit: Int) {
    channelCategoryCollection(preview: $preview, locale: $locale, limit: $limit, order: [name_ASC]) {
      total
      items {
        name
        linkedFrom {
          channelCategoryPageCollection(limit: 1) {
            items {
              urlSubfolder
              slug
            }
          }
        }
      }
    }
  }
`;

const ChannelsByCategory =  /* GraphQL */`
  query ChannelsByCategory($locale: String, $preview: Boolean, $limit: Int, $skip: Int, $categroyName: String) {
    channelCategoryCollection(preview: $preview, locale: $locale, limit: 1, where: { name: $categroyName}) {
      items {
        name
        linkedFrom {
          supportedChannelCollection(limit: $limit, skip: $skip, order: [name_ASC]) {
            total
            items {
              name
              linkedFrom {
                channelPageCollection(limit: 1) {
                  items {
                    urlSubfolder
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

module.exports = {
  queries: {
    BlogPostsByCategory,
    AllBlogPosts,
    BlogPostAmount,
    GlossaryPages,
    GlossaryPagesByCategoryId,
    AllGlossaryPages,
    GlossaryListGroups,
    Header,
    Footer,
    LatestBlogPostTeasersByCategory,
    BlogPostTeasers,
    CustomerTeasers,
    EventTeasers,
    PartnerTeasers,
    ChannelOverviewPages,
    SupportedChannels,
    ExportChannels,
    ChannelCategories,
    ChannelsByCategory
  }
}
