/**
 * inspired by tianma-combo
 */
const PATTERN_COMBO_URL = /^(\/.*?)(?:\?|%3F){2}(.*?)(\?.*)?$/i;
const PATTERN_COMMA = /(?:,|%2C)/i;


function parseURL(options) {
  const { comboUrlPattern, commaPattern, url } = options;
  let re = url.match(comboUrlPattern);
  if (re) {
    return re[2].split(commaPattern).map((pathname) => {
      return re[1] + pathname + (re[3] || '?');
    });
  }
  return null;
}

/**
 * Filter factory.
 * @param [fileDelimiter] {Object}
 * @return {Function}
 */
module.exports = function () {

  // const {
  //   delimiter,
  //   seperator } = options;

  const fileDelimiter = {
    'application/javascript': '\n',
    'text/css': '\n',
  };

  return function* (next) {
    const req = this.request;
    const res = this.response;

    let original = req.path;
    let datum = [];

    let paths = parseURL({
      url: original,
      comboUrlPattern: PATTERN_COMBO_URL,
      commaPattern: PATTERN_COMMA,
    });
    let type;
    let mtime;

    if (req.method() === 'GET' && paths) {
      for (let i = 0, len = paths.length; i < len; ++i) {
        req.url(paths[i]);

        yield next;

        if (res.status() !== 200) {
          throw new Error(`Failed to get "${req.pathname}"`);
        }

        if (!type) {
          type = res.type();
        } else if (type !== res.type()) {
          throw new Error(`MIME of "${req.pathname}" is inconsistent with others`);
        }

        if (res.head('last-modified')) {
          if (mtime) {
            mtime = Math.max(new Date(res.head('last-modified')), mtime);
          } else {
            mtime = new Date(res.head('last-modified')).getTime();
          }
        }

        datum.push(res.data());

        if (fileDelimiter[type]) {
          datum.push(fileDelimiter[type]);
        }
      }

      // Restore the original URL.
      req.url(original);

      // Use the latest mtime.
      if (mtime) {
        res.head('last-modified', new Date(mtime).toGMTString());
      }
      res.data(datum);
    } else {
      yield next;
    }
  };
};
