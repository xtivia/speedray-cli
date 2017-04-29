'use strict';

var MockUI = require('./mock-ui');
var Cli = require('@speedray/cli/lib/cli');

module.exports = function sr(args) {
  var cli;

  process.env.PWD = process.cwd();

  cli = new Cli({
    inputStream: [],
    outputStream: [],
    cliArgs: args,
    UI: MockUI,
    testing: true
  });

  return cli;
};
