const Command = require('../ember-cli/lib/models/command');
const SilentError = require('silent-error');


const DestroyCommand = Command.extend({
  name: 'destroy',
  aliases: ['d'],
  works: 'insideProject',

  anonymousOptions: [
    '<blueprint>'
  ],

  run: function() {
    return Promise.reject(new SilentError('The destroy command is not supported by Speedray CLI.'));
  }
});

export default DestroyCommand;
DestroyCommand.overrideCore = true;
