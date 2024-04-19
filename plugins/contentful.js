const contentful = require('contentful')
const { createContentfulConfiguration } = require('./contentfulConfiguration');

const proxyConfig = {
  proxy: {
    host: 'localhost',
    port: 80,
  },
};

module.exports = {
  createClient() {
    const config = createContentfulConfiguration();
    if (process.env.USE_CACHE) {
      return contentful.createClient({
        ...config,
        ...proxyConfig,
      });
    }

    return contentful.createClient(config);
  },
};
