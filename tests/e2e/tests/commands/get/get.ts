import {sr} from '../../../utils/process';
import {expectToFail} from '../../../utils/utils';

export default function() {
  return Promise.resolve()
    .then(() => expectToFail(() => sr('get', 'apps.zzz.prefix')))
    .then(() => sr('get'))
    .then(() => sr('get', 'apps.0.prefix'))
    .then(({ stdout }) => {
      if (!stdout.match(/app/)) {
        throw new Error(`Expected "app", received "${JSON.stringify(stdout)}".`);
      }
    });
}
