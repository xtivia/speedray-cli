const fs = require('fs-extra');
const sr = require('../helpers/sr');
const existsSync = require('exists-sync');
const expect = require('chai').expect;
const forEach = require('lodash/forEach');
const walkSync = require('walk-sync');
const Blueprint = require('@speedray/cli/ember-cli/lib/models/blueprint');
const path = require('path');
const tmp = require('../helpers/tmp');
const root = process.cwd();
const util = require('util');
const EOL = require('os').EOL;
const SilentError = require('silent-error');

describe('Acceptance: sr new', function () {
  beforeEach(function () {
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    });
  });

  afterEach(function () {
    this.timeout(10000);

    return tmp.teardown('./tmp');
  });

  function confirmBlueprintedForDir(dir) {
    return function () {
      let blueprintPath = path.join(root, dir, 'files');
      let expected = walkSync(blueprintPath);
      let actual = walkSync('.').sort();
      let directory = path.basename(process.cwd());

      forEach(Blueprint.renamedFiles, function (destFile, srcFile) {
        expected[expected.indexOf(srcFile)] = destFile;
      });

      expected.forEach(function (file, index) {
        expected[index] = file.replace(/__name__/g, '@speedray/cli');
      });

      expected.sort();

      expect(directory).to.equal('foo');
      expect(expected).to.deep.equal(
        actual,
        EOL + ' expected: ' + util.inspect(expected) + EOL + ' but got: ' + util.inspect(actual));

    };
  }

  function confirmBlueprinted() {
    return confirmBlueprintedForDir('blueprints/sr');
  }

  it('requires a valid name (!)', () => {
    return sr(['new', '!', '--skip-install', '--skip-git', '--inline-template'])
      .then(() => { throw new Error(); }, () => {});
  });
  it('requires a valid name (abc-.)', () => {
    return sr(['new', 'abc-.', '--skip-install', '--skip-git', '--inline-template'])
      .then(() => { throw new Error(); }, () => {});
  });
  it('requires a valid name (abc-)', () => {
    return sr(['new', 'abc-', '--skip-install', '--skip-git', '--inline-template'])
      .then(() => { throw new Error(); }, () => {});
  });
  it('requires a valid name (abc-def-)', () => {
    return sr(['new', 'abc-def-', '--skip-install', '--skip-git', '--inline-template'])
      .then(() => { throw new Error(); }, () => {});
  });
  it('requires a valid name (abc-123)', () => {
    return sr(['new', 'abc-123', '--skip-install', '--skip-git', '--inline-template'])
      .then(() => { throw new Error(); }, () => {});
  });
  it('requires a valid name (abc)', () => {
    return sr(['new', 'abc', '--skip-install', '--skip-git', '--inline-template']);
  });
  it('requires a valid name (abc-def)', () => {
    return sr(['new', 'abc-def', '--skip-install', '--skip-git', '--inline-template']);
  });

  it('sr new foo, where foo does not yet exist, works', function () {
    return sr(['new', 'foo', '--skip-install']).then(confirmBlueprinted);
  });

  it('sr new with empty app does throw exception', function () {
    expect(sr(['new', ''])).to.throw;
  });

  it('sr new without app name does throw exception', function () {
    expect(sr(['new', ''])).to.throw;
  });

  it('sr new with app name creates new directory and has a dasherized package name', function () {
    return sr(['new', 'FooApp', '--skip-install', '--skip-git']).then(function () {
      expect(!existsSync('FooApp'));

      const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      expect(pkgJson.name).to.equal('foo-app');
    });
  });

  it('sr new has a .editorconfig file', function () {
    return sr(['new', 'FooApp', '--skip-install', '--skip-git']).then(function () {
      expect(!existsSync('FooApp'));

      const editorConfig = fs.readFileSync('.editorconfig', 'utf8');
      expect(editorConfig).to.exist;
    });
  });

  it('Cannot run sr new, inside of Speedray CLI project', function () {
    return sr(['new', 'foo', '--skip-install', '--skip-git'])
      .then(function () {
        return sr(['new', 'foo', '--skip-install', '--skip-git']).then(() => {
          throw new SilentError('Cannot run sr new, inside of Speedray CLI project should fail.');
        }, () => {
          expect(!existsSync('foo'));
        });
      })
      .then(confirmBlueprinted);
  });

  it('sr new without skip-git flag creates .git dir', function () {
    return sr(['new', 'foo', '--skip-install']).then(function () {
      expect(existsSync('.git'));
    });
  });

  it('sr new with --dry-run does not create new directory', function () {
    return sr(['new', 'foo', '--dry-run']).then(function () {
      const cwd = process.cwd();
      expect(cwd).to.not.match(/foo/, 'does not change cwd to foo in a dry run');
      expect(!existsSync(path.join(cwd, 'foo')), 'does not create new directory');
      expect(!existsSync(path.join(cwd, '.git')), 'does not create git in current directory');
    });
  });

  it('sr new with --directory uses given directory name and has correct package name', function () {
    return sr(['new', 'foo', '--skip-install', '--skip-git', '--directory=bar'])
      .then(function () {
        const cwd = process.cwd();
        expect(cwd).to.not.match(/foo/, 'does not use app name for directory name');
        expect(!existsSync(path.join(cwd, 'foo')), 'does not create new directory with app name');

        expect(cwd).to.match(/bar/, 'uses given directory name');
        expect(existsSync(path.join(cwd, 'bar')), 'creates new directory with specified name');

        const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        expect(pkgJson.name).to.equal('foo', 'uses app name for package name');
      });
  });

  it('sr new --inline-template does not generate a template file', () => {
    return sr(['new', 'foo', '--skip-install', '--skip-git', '--inline-template'])
      .then(() => {
        const templateFile = path.join('src', 'app', 'app.component.html');
        expect(existsSync(templateFile)).to.equal(false);
      });
  });

  it('sr new --inline-style does not gener a style file', () => {
    return sr(['new', 'foo', '--skip-install', '--skip-git', '--inline-style'])
      .then(() => {
        const styleFile = path.join('src', 'app', 'app.component.css');
        expect(existsSync(styleFile)).to.equal(false);
      });
  });

  it('should skip spec files when passed --skip-tests', () => {
    return sr(['new', 'foo', '--skip-install', '--skip-git', '--skip-tests'])
      .then(() => {
        const specFile = path.join('src', 'app', 'app.component.spec.ts');
        expect(existsSync(specFile)).to.equal(false);
      });
  });

});
