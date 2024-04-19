'use strict';

// for the algorithm

const LOCALES = [
  'de', 'fr', 'it', 'es'
];

function isLocalized(uri) {
  for (const locale of LOCALES)
    if (uri.startsWith('/' + locale + '/'))
      return true;
  return false;
}

function removeLocalization(uri) {
  return uri.substr(3);
}

exports.handler = async (event) => {
  const response = event.Records[0].cf.response;

  if (response.status === '302') {
    response.status = '301';
    response.statusDescription = 'Moved Permanently'
  }

  if (response.status === '404') {
    const uri = event.Records[0].cf.request.uri;
    if (isLocalized(uri)) {
      const unlocalizedUri = removeLocalization(uri);
      return {
        status: '302',
        body: '',
        statusDescription: 'Moved Temporarily',
        headers: {
          'Location': [
            {
              key: 'Location',
              value: unlocalizedUri
            }
          ]
        }
      };
    }
  }

  return response;
};
