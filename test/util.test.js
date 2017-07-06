/* eslint import/no-extraneous-dependencies: 0 */

const util = require('../lib/util');
const assert = require('assert');

describe('util', () => {
  describe('#getFreshPort()', () => {
    it('should return a number above 20000 and should be deferent each time', (done) => {
      util.getFreshPort().then((port1) => {
        util.getFreshPort().then((port2) => {
          assert(port1 > 20000);
          assert(port2 > 20000);
          assert(port1 !== port2);
          done();
        });
      });
    });
  });

  describe('#parseRuleValue()', () => {
    it('should return an object', () => {
      assert.deepEqual({
        delimiter: '/c/=',
        seperator: ',',
        root: __dirname,
      }, util.parseRuleValue(`/c/=:,@${__dirname}`));

      assert.deepEqual({
        delimiter: '??',
        seperator: ',',
        root: '/Users/jiewei.ljw/work/wwwwww/test',
      }, util.parseRuleValue('/Users/jiewei.ljw/work/wwwwww/test'));
    });
  });
});
