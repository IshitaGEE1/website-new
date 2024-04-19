'use strict';

// for the algorithm

const redirects = require('./redirects.json');
const querystring = require('querystring');

const defaultHandler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri + (request.uri.endsWith('/') ? '' : '/');

  if (request.querystring) {
    const params = querystring.parse(request.querystring);
    if (params.gh_jid) {
      let target = undefined;
      if (uri === '/careers/')
        target = '/careers/open-roles/?' + request.querystring;
      if (uri === '/de/karriere/')
        target = '/de/karriere/offene-stellen/?' + request.querystring;
      if (uri === '/fr/carriere/')
        target = '/fr/carriere/open-roles/?' + request.querystring;

      const response = {
        status: '301',
        body: '',
        statusDescription: 'Moved Permanently',
        headers: {
          'Location': [
            {
              key: 'Location',
              value: target
            }
          ]
        }
      };

      if (target)
        callback(null, response);
    }
  }

  const filtered = redirects.filter(e => e.from === uri);
  if (filtered.length === 1) {
    const redirect = filtered[0];
    const response = {
      status: '301',
      body: '',
      statusDescription: 'Moved Permanently',
      headers: {
        'Location': [
          {
            key: 'Location',
            value: redirect.to

          }
        ]
      }
    };
    callback(null, response);
  }

  // Continue request processing if authentication passed
  callback(null, request);
};

const handlerWithBasicAuth = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  const authUser = 'productsup';
  const authPass = 'f.EJCVFUCEf-YYhy?@MGqgH}';

  const authString = 'Basic ' + new Buffer(authUser + ':' + authPass).toString('base64');

  if (typeof headers.authorization == 'undefined' || headers.authorization[0].value !== authString) {
    const body = 'Unauthorized';
    const response = {
      status: '401',
      statusDescription: 'Unauthorized',
      body: body,
      headers: {
        'www-authenticate': [{key: 'WWW-Authenticate', value: 'Basic'}]
      },
    };
    callback(null, response);
  }

  defaultHandler(event, context, callback);
};

exports.handler = defaultHandler;
exports.handlerWithBasicAuth = handlerWithBasicAuth;
