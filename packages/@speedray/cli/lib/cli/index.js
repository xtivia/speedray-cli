/*eslint-disable no-console */

// Prevent the dependency validation from tripping because we don't import these. We need
// it as a peer dependency of @angular/core.
// require('zone.js')


// This file hooks up on require calls to transpile TypeScript.
const cli = require('../../ember-cli/lib/cli');
const UI = require('../../ember-cli/lib/ui');
const path = require('path');

function loadCommands() {
  return {
    'build': require('@angular/cli/commands/build').default,
    'serve': require('@angular/cli/commands/serve').default,
    'eject': require('@angular/cli/commands/eject').default,
    'new': require('@angular/cli/commands/new').default,
    'generate': require('@angular/cli/commands/generate').default,
    'destroy': require('@angular/cli/commands/destroy').default,
    'test': require('@angular/cli/commands/test').default,
    'e2e': require('@angular/cli/commands/e2e').default,
    'help': require('../../commands/help').default,
    'lint': require('@angular/cli/commands/lint').default,
    'version': require('@angular/cli/commands/version').default,
    'completion': require('@angular/cli/commands/completion').default,
    'doc': require('../../commands/doc').default,
    'xi18n': require('@angular/cli/commands/xi18n').default,

    // Easter eggs.
    'make-this-awesome': require('@angular/cli/commands/easter-egg').default,

    // Configuration.
    'set': require('@angular/cli/commands/set').default,
    'get': require('@angular/cli/commands/get').default,

    // Liferay DXP addons.
    'deploy': require('../../commands/deploy').default,
    'jar': require('../../commands/jar').default,
  };
}

module.exports = function(options) {

  // patch UI to not print Ember-CLI warnings (which don't apply to Angular CLI)
  UI.prototype.writeWarnLine = function () { }

  options.cli = {
    name: 'sr',
    root: path.join(__dirname, '..', '..'),
    npmPackage: '@speedray/cli'
  };

  options.commands = loadCommands();

  // ensure the environemnt variable for dynamic paths
  process.env.PWD = path.normalize(process.env.PWD || process.cwd());
  process.env.CLI_ROOT = process.env.CLI_ROOT || path.resolve(__dirname, '..', '..');

  return cli(options);
};
