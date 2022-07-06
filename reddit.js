const snoowrap = require('snoowrap');

const initAPI = (token) => {
  const r = new snoowrap({
    userAgent: 'Suspicious-Novel-412',
    clientId: 'INwhUBiP5GHYBrU2BXBtvQ',
    clientSecret: 'QlOJqDioyKWjcq-yvGAf7B1AbaHBVg',
    refreshToken: token
  });
}

exports.initAPI = initAPI
