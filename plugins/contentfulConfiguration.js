function createContentfulConfiguration() {
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'fallback';

  console.log('ENVIRONMENT', environment);

  return {
    space: 'q17uls4wkkdz',
    accessToken: process.env.CTF_PREVIEW
      ? 'hRK6RDr_ZULih7PuJgVkSTSl9kDqYr7cqfh5KvdCvow'
      : '-hGtrR28CV2kk9-OQPRsx6rYDXNaI3WxAgshVJLBT6c',
    host: process.env.CTF_PREVIEW ? 'preview.contentful.com' : 'cdn.contentful.com',
    environment: environment
  };
}

module.exports = {
  createContentfulConfiguration,
};
