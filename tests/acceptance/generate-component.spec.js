'use strict';

var fs = require('fs-extra');
var sr = require('../helpers/sr');
var existsSync = require('exists-sync');
var expect = require('chai').expect;
var path = require('path');
var tmp = require('../helpers/tmp');
var root = process.cwd();
var Promise = require('@speedray/cli/ember-cli/lib/ext/promise');
var SilentError = require('silent-error');
const denodeify = require('denodeify');

const readFile = denodeify(fs.readFile);


describe('Acceptance: sr generate component', function () {
  beforeEach(function () {
    this.timeout(10000);
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

  it('my-comp', function () {
    const testPath = path.join(root, 'tmp/foo/src/app/my-comp/my-comp.component.ts');
    const appModule = path.join(root, 'tmp/foo/src/app/app.module.ts');
    return sr(['generate', 'component', 'my-comp'])
      .then(() => expect(existsSync(testPath)).to.equal(true))
      .then(() => readFile(appModule, 'utf-8'))
      .then(content => {
        // Expect that the app.module contains a reference to my-comp and its import.
        expect(content).matches(/import.*MyCompComponent.*from '.\/my-comp\/my-comp.component';/);
        expect(content).matches(/declarations:\s*\[[^\]]+?,\r?\n\s+MyCompComponent\r?\n/m);
      });
  });

  it('generating my-comp twice does not add two declarations to module', function () {
    const appModule = path.join(root, 'tmp/foo/src/app/app.module.ts');
    return sr(['generate', 'component', 'my-comp'])
      .then(() => sr(['generate', 'component', 'my-comp']))
      .then(() => readFile(appModule, 'utf-8'))
      .then(content => {
        expect(content).matches(/declarations:\s+\[\r?\n\s+AppComponent,\r?\n\s+MyCompComponent\r?\n\s+\]/m);
      });
  });

  it('test' + path.sep + 'my-comp', function () {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', 'test'));
    return sr(['generate', 'component', 'test' + path.sep + 'my-comp']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'test', 'my-comp', 'my-comp.component.ts');
      expect(existsSync(testPath)).to.equal(true);
    });
  });

  it('test' + path.sep + '..' + path.sep + 'my-comp', function () {
    return sr(['generate', 'component', 'test' + path.sep + '..' + path.sep + 'my-comp'])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it('my-comp from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        return sr(['generate', 'component', 'my-comp'])
      })
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-comp', 'my-comp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it('child-dir' + path.sep + 'my-comp from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir'));
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => process.chdir('./1'))
      .then(() => {
        return sr(['generate', 'component', 'child-dir' + path.sep + 'my-comp'])
      })
      .then(() => {
        var testPath = path.join(
          root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir', 'my-comp', 'my-comp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it('child-dir' + path.sep + '..' + path.sep + 'my-comp from a child dir', () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return Promise.resolve()
      .then(() => process.chdir(path.normalize('./src/app/1')))
      .then(() => {
        return sr([
          'generate', 'component', 'child-dir' + path.sep + '..' + path.sep + 'my-comp'
        ])
      })
      .then(() => {
        var testPath =
          path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-comp', 'my-comp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it(path.sep + 'my-comp from a child dir, gens under ' + path.join('src', 'app'), () => {
    fs.mkdirsSync(path.join(root, 'tmp', 'foo', 'src', 'app', '1'));
    return Promise.resolve()
      .then(() => process.chdir(path.normalize('./src/app/1')))
      .then(() => {
        return sr(['generate', 'component', path.sep + 'my-comp'])
      })
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it('..' + path.sep + 'my-comp from root dir will fail', () => {
    return sr(['generate', 'component', '..' + path.sep + 'my-comp']).then(() => {
      throw new SilentError(`sr generate component ..${path.sep}my-comp from root dir should fail.`);
    }, (err) => {
      expect(err).to.equal(`Invalid path: "..${path.sep}my-comp" cannot be above the "src${path.sep}app" directory`);
    });
  });

  it('mycomp will prefix selector', () => {
    return sr(['generate', 'component', 'mycomp'])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
        var contents = fs.readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'app-mycomp\'') === -1).to.equal(false);
      });
  });

  it('mycomp --no-prefix will not prefix selector', () => {
    return sr(['generate', 'component', 'mycomp', '--no-prefix'])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
        var contents = fs.readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'mycomp\'') === -1).to.equal(false);
      });
  });

  it('mycomp --prefix= will not prefix selector', () => {
    return sr(['generate', 'component', 'mycomp', '--prefix='])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
        var contents = fs.readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'mycomp\'') === -1).to.equal(false);
      });
  });

  it('mycomp --prefix=test will prefix selector with \'test-\'', () => {
    return sr(['generate', 'component', 'mycomp', '--prefix=test'])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'mycomp', 'mycomp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
        var contents = fs.readFileSync(testPath, 'utf8');
        expect(contents.indexOf('selector: \'test-mycomp\'') === -1).to.equal(false);
      });
  });

  it('myComp will succeed', () => {
    return sr(['generate', 'component', 'myComp'])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it(`non${path.sep}existing${path.sep}dir${path.sep}myComp will create dir and succeed`, () => {
    const testPath =
      path.join(root, 'tmp', 'foo', 'src', 'app', 'non', 'existing', 'dir', 'my-comp', 'my-comp.component.ts');
    const appModule = path.join(root, 'tmp', 'foo', 'src', 'app', 'app.module.ts');
    return sr(['generate', 'component', `non${path.sep}existing${path.sep}dir${path.sep}myComp`])
      .then(() => expect(existsSync(testPath)).to.equal(true))
      .then(() => readFile(appModule, 'utf-8'))
      .then(content => {
        // Expect that the app.module contains a reference to my-comp and its import.
        expect(content)
          .matches(/import.*MyCompComponent.*from '.\/non\/existing\/dir\/my-comp\/my-comp.component';/);
      });
  });

  it('my-comp --inline-template', function () {
    return sr(['generate', 'component', 'my-comp', '--inline-template']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.html');
      expect(existsSync(testPath)).to.equal(false);
    });
  });

  it('my-comp --inline-style', function () {
    return sr(['generate', 'component', 'my-comp', '--inline-style']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.css');
      expect(existsSync(testPath)).to.equal(false);
    });
  });

  it('my-comp --no-spec', function () {
    return sr(['generate', 'component', 'my-comp', '--no-spec']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.component.spec.ts');
      expect(existsSync(testPath)).to.equal(false);
    });
  });
});
