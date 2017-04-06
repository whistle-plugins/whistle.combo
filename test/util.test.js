const util = require('../lib/util');
const expect = require('Chai').expect; // eslint-disable-line

describe('util', () => {
  describe('#getFreshPort()', () => {
    it('should return a number between 3000 and 60000, & should be deferent each time', (done) => {
      util.getFreshPort().then((port1) => {
        util.getFreshPort().then((port2) => {
          expect(port1).to.be.below(60000);
          expect(port1).to.be.above(30000);

          expect(port2).to.be.below(60000);
          expect(port2).to.be.above(30000);

          expect(Math.abs(port1 - port2) > 0 && port1 > 30000 && port2 < 60000);
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
        root: '/Users/jiewei.ljw/work/wwwwww/test',
      }).to.eql(util.parseRuleValue('/c/=:,@/Users/jiewei.ljw/work/wwwwww/test'));

      expect({
        delimiter: '??',
        seperator: ',',
        root: '/Users/jiewei.ljw/work/wwwwww/test',
      }).to.eql(util.parseRuleValue('/Users/jiewei.ljw/work/wwwwww/test'));
    });
  });
});
