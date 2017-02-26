const fs = require('fs');
const https = require('https');

exports.createServer = function (options) {
  const listener = options.listener;
  const certAbsFilename = options.certAbsFilename;
  const keyAbsFilename = options.keyAbsFilename;

  return https.createServer({
    key: fs.readFileSync(keyAbsFilename),
    cert: fs.readFileSync(certAbsFilename),
  }, listener);
};
