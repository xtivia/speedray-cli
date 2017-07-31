import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';
import {expectToFail} from '../../utils/utils';
import {getGlobalVariable} from '../../utils/env';


export default function() {
  // Skip this in Appveyor tests.
  if (getGlobalVariable('argv').appveyor) {
    return Promise.resolve();
  }

  return sr('build', '--sourcemaps')
    .then(() => expectFileToExist('dist/main.bundle.js.map'))

    .then(() => sr('build', '--no-sourcemap'))
    .then(() => expectToFail(() => expectFileToExist('dist/main.bundle.js.map')))

    .then(() => sr('build', '--prod', '--output-hashing=none'))
    .then(() => expectToFail(() => expectFileToExist('dist/main.bundle.js.map')))

    .then(() => sr('build', '--prod', '--output-hashing=none', '--sourcemap'))
    .then(() => expectFileToExist('dist/main.bundle.js.map'));
}
