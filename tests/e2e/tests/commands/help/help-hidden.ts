import { oneLine } from 'common-tags';

import { silentNg } from '../../../utils/process';


export default function() {
  return Promise.resolve()
    .then(() => silentNg('--help'))
    .then(({ stdout }) => {
      if (stdout.match(/(easter-egg)|(sr make-this-awesome)|(sr init)/)) {
        throw new Error(oneLine`
          Expected to not match "(easter-egg)|(sr make-this-awesome)|(sr init)"
          in help output.
        `);
      }
    })
    .then(() => silentNg('--help', 'new'))
    .then(({ stdout }) => {
      if (stdout.match(/--link-cli/)) {
        throw new Error(oneLine`
          Expected to not match "--link-cli"
          in help output.
        `);
      }
    })
}
