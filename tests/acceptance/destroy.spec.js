'use strict';

const sr = require('../helpers/sr');
const tmp = require('../helpers/tmp');
const SilentError = require('silent-error');
const expect = require('chai').expect;

describe('Acceptance: sr destroy', function () {
  beforeEach(function () {
    this.timeout(10000);
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    }).then(function () {
      return sr(['new', 'foo', '--skip-install']);
    });
  });

  afterEach(function () {
    return tmp.teardown('./tmp');
  });

  it('without args should fail', function () {
    return sr(['destroy']).then(() => {
      throw new SilentError('sr destroy should fail.');
    }, (err) => {
      expect(err.message).to.equal('The destroy command is not supported by Speedray CLI.');
    });
  });

  it('with args should fail', function () {
    return sr(['destroy', 'something']).then(() => {
      throw new SilentError('sr destroy something should fail.');
    }, (err) => {
      expect(err.message).to.equal('The destroy command is not supported by Speedray CLI.');
    });
  });
});
