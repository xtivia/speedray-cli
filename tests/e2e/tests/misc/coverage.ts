import {expectFileToExist, expectFileToMatch} from '../../utils/fs';
import {updateJsonFile} from '../../utils/project';
import {expectToFail} from '../../utils/utils';
import {sr} from '../../utils/process';


export default function () {
  return sr('test', '--single-run', '--code-coverage')
    .then(() => expectFileToExist('coverage/src/app'))
    .then(() => expectFileToExist('coverage/lcov.info'))
    // Verify code coverage exclude work
    .then(() => expectFileToMatch('coverage/lcov.info', 'polyfills.ts'))
    .then(() => expectFileToMatch('coverage/lcov.info', 'test.ts'))
    .then(() => updateJsonFile('.speedray-cli.json', configJson => {
      const test = configJson['test'];
      test['codeCoverage'] = {
        exclude: [
          'src/polyfills.ts',
          '**/test.ts'
        ]
      };
    }))
    .then(() => sr('test', '--single-run', '--code-coverage'))
    .then(() => expectToFail(() => expectFileToMatch('coverage/lcov.info', 'polyfills.ts')))
    .then(() => expectToFail(() => expectFileToMatch('coverage/lcov.info', 'test.ts')));
}
