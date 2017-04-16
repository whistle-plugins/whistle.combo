/* eslint import/no-extraneous-dependencies: 0 */

const util = require('../lib/util');
const expect = require('chai').expect;

describe('util', () => {
  describe('#getFreshPort()', () => {
    it('should return a number above 20000 and should be deferent each time', (done) => {
      util.getFreshPort().then((port1) => {
        util.getFreshPort().then((port2) => {
          expect(port1).to.be.above(20000);
          expect(port2).to.be.above(20000);
          expect(Math.abs(port1 - port2) > 0);
          done();
        });
      });
    });
  });

  describe('#parseRuleValue()', () => {
    it('should return an object', () => {
      expect({
        delimiter: '/c/=',
        seperator: ',',
        root: __dirname,
      }).to.eql(util.parseRuleValue(`/c/=:,@${__dirname}`));

      expect({
        delimiter: '??',
        seperator: ',',
        root: '/Users/jiewei.ljw/work/wwwwww/test',
      }).to.eql(util.parseRuleValue('/Users/jiewei.ljw/work/wwwwww/test'));
    });
  });
});
