'use strict';

const sr = require('../helpers/sr');
const tmp = require('../helpers/tmp');

const existsSync = require('exists-sync');
const expect = require('chai').expect;
const path = require('path');
const root = process.cwd();

const testPath = path.join(root, 'tmp', 'foo', 'src', 'app');

describe('Acceptance: sr generate class', function () {
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

  it('sr generate class my-class', function () {
    return sr(['generate', 'class', 'my-class']).then(() => {
      expect(existsSync(path.join(testPath, 'my-class.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'my-class.spec.ts'))).to.equal(false);
    });
  });

  it('sr generate class my-class --no-spec', function () {
    return sr(['generate', 'class', 'my-class', '--no-spec']).then(() => {
      expect(existsSync(path.join(testPath, 'my-class.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'my-class.spec.ts'))).to.equal(false);
    });
  });

  it('sr generate class my-class.model', function () {
    return sr(['generate', 'class', 'my-class.model']).then(() => {
      expect(existsSync(path.join(testPath, 'my-class.model.ts'))).to.equal(true);
    });
  });
});
