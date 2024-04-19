const HubspotConfig = {
  basicScript: {
    src: 'https://js.hs-scripts.com/3976985.js',
    id: 'hs-script-loader',
    async: true,
    defer: true,
    body: true,
  },
  formScript: {
    src: 'https://js.hsforms.net/forms/v2.js',
    charset: 'utf-8',
    body: true,
  }
};

export default HubspotConfig;
