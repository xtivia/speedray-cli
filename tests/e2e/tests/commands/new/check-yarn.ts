import {sr} from '../../../utils/process';
import {getGlobalVariable} from '../../../utils/env';

const yarnRegEx = /You can `sr set --global packageManager=yarn`./;

export default function() {
  return Promise.resolve()
    .then(() => process.chdir(getGlobalVariable('tmp-root')))
    .then(() =>  sr('set', '--global', 'packageManager=default'))
    .then(() =>  sr('new', 'foo'))
    .then(({ stdout }) => {
      // Assuming yarn is installed and checking for message with yarn.
      if (!stdout.match(yarnRegEx)) {
        throw new Error('Should display message to use yarn packageManager');
      }
    });
}
