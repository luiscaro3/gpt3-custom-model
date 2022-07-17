const snoowrap = require('snoowrap');

const initAPI = () => {
  return new snoowrap({
    userAgent: 'chrome:ReadMeClient:v0.1 by /u/Suspicious-Novel-412',
    clientId: '_9ffanHdAj_kXDgL0quzWA',
    clientSecret: 'Ha4Qr8PEv_sE4yYpS25gzfyipJQwSg',
    username: 'Suspicious-Novel-412',
    password: '=_umj&s5@XQ4Lq/',
  });
}

exports.initAPI = initAPI
