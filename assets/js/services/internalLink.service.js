const InternalLinkService = {
  processLink,
}

export default InternalLinkService;

function processLink(rawLink) {
  return rawLink.endsWith('/') ? rawLink : (rawLink + '/')
}
