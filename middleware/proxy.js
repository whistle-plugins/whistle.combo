const fs = require('co-fs');
const path = require('path');

module.exports = (root) => {
  return function* (next) {
    const req = this.request;
    const parts = req.pathname.split('/');
    let dir = path.join(root, parts[1]);

    if (!(yield fs.exists(dir))) {
      yield next;
    }
  };
};
