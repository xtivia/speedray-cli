import {sr} from '../../../utils/process';
import {expectToFail} from '../../../utils/utils';

export default function() {
  return Promise.resolve()
    .then(() => expectToFail(() => sr('set', 'apps.zzz.prefix')))
    .then(() => sr('set', 'apps.0.prefix' , 'new-prefix'))
    .then(() => sr('get', 'apps.0.prefix'))
    .then(({ stdout }) => {
      if (!stdout.match(/new-prefix/)) {
        throw new Error(`Expected "new-prefix", received "${JSON.stringify(stdout)}".`);
      }
    });
}
