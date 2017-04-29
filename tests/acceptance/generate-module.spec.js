'use strict';

const sr = require('../helpers/sr');
const tmp = require('../helpers/tmp');
const fs = require('fs-extra');
const existsSync = require('exists-sync');
const expect = require('chai').expect;
const Promise = require('@speedray/cli/ember-cli/lib/ext/promise');
const path = require('path');
const root = process.cwd();

const testPath = path.join(root, 'tmp', 'foo', 'src', 'app');

describe('Acceptance: sr generate module', function () {
  beforeEach(function () {
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    }).then(function () {
      return sr(['new', 'foo', '--skip-install']);
    });
  });

  afterEach(function () {
    this.timeout(10000);

    return tmp.teardown('./tmp');
  });

  it('will fail if no name is specified', function () {
    return sr(['generate', 'module']).catch((error) => {
      expect(error).to.equal('The `sr generate module` command requires a name to be specified.');
    });
  });

  it('sr generate module my-module', function () {
    return sr(['generate', 'module', 'my-module']).then(() => {
      expect(existsSync(path.join(testPath, 'my-module', 'my-module.module.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'my-module', 'my-module.module.spec.ts'))).to.equal(false);
    });
  });

  it('sr generate module  generate routing file when passed flag --routing', function () {
    return sr(['generate', 'module', 'my-module', '--routing']).then(() => {
      expect(existsSync(path.join(testPath, 'my-module', 'my-module.module.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'my-module', 'my-module-routing.module.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'my-module', 'my-module.module.spec.ts'))).to.equal(false);
    })
  });

  it('sr generate module my-module --spec', function () {
    return sr(['generate', 'module', 'my-module', '--spec']).then(() => {
      expect(existsSync(path.join(testPath, 'my-module', 'my-module.module.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'my-module', 'my-module.module.spec.ts'))).to.equal(true);
    });
  });

  it('sr generate module TwoWord', function () {
    return sr(['generate', 'module', 'TwoWord']).then(() => {
      expect(existsSync(path.join(testPath, 'two-word', 'two-word.module.ts'))).to.equal(true);
      expect(existsSync(path.join(testPath, 'two-word', 'two-word.module.spec.ts'))).to.equal(false);
    });
  });

  it('sr generate module parent/child', function () {
    return sr(['generate', 'module', 'parent']).then(() =>
      sr(['generate', 'module', 'parent/child']).then(() => {
        expect(existsSync(path.join(testPath, 'parent/child', 'child.module.ts'))).to.equal(true);
        expect(existsSync(path.join(testPath, 'parent/child', 'child.module.spec.ts'))).to.equal(false);
      })
    );
  });

  it('sr generate module child should work in sub-dir', function () {
    fs.mkdirSync(path.join(testPath, './sub-dir'));
    return new Promise(resolve => {
      process.chdir(path.join(testPath, './sub-dir'));
      return resolve();
    }).then(() =>
      sr(['generate', 'module', 'child']).then(() => {
        expect(existsSync(path.join(testPath, 'sub-dir/child', 'child.module.ts'))).to.equal(true);
        expect(existsSync(path.join(testPath, 'sub-dir/child', 'child.module.spec.ts'))).to.equal(false);
      })
    );
  });

  it('sr generate module child should work in sub-dir with routing file when passed --routing flag', function () {
    fs.mkdirSync(path.join(testPath, './sub-dir'));
    return new Promise(resolve => {
      process.chdir(path.join(testPath, './sub-dir'));
      return resolve();
    }).then(() =>
      sr(['generate', 'module', 'child', '--routing']).then(() => {
        expect(existsSync(path.join(testPath, 'sub-dir/child', 'child.module.ts'))).to.equal(true);
        expect(existsSync(path.join(testPath, 'sub-dir/child', 'child-routing.module.ts'))).to.equal(true);
        expect(existsSync(path.join(testPath, 'sub-dir/child', 'child.module.spec.ts'))).to.equal(false);
      })
    );
  });

  it('sr generate module should generate parent/child module with routing file when passed --routing flag', function () {
    return sr(['generate', 'module', 'parent']).then(() =>
      sr(['generate', 'module', 'parent/child', '--routing']).then(() => {
        expect(existsSync(path.join(testPath, 'parent/child', 'child.module.ts'))).to.equal(true);
        expect(existsSync(path.join(testPath, 'parent/child', 'child-routing.module.ts'))).to.equal(true);
        expect(existsSync(path.join(testPath, 'parent/child', 'child.module.spec.ts'))).to.equal(false);
      })
    );
  });
});
