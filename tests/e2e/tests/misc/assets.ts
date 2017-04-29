import {writeFile, expectFileToExist, expectFileToMatch} from '../../utils/fs';
import {sr} from '../../utils/process';
import {updateJsonFile} from '../../utils/project';
import {expectToFail} from '../../utils/utils';


export default function() {
  return writeFile('src/assets/.file', '')
    .then(() => writeFile('src/assets/test.abc', 'hello world'))
    .then(() => sr('build'))
    .then(() => expectFileToExist('dist/favicon.ico'))
    .then(() => expectFileToExist('dist/assets/.file'))
    .then(() => expectFileToMatch('dist/assets/test.abc', 'hello world'))
    .then(() => expectToFail(() => expectFileToExist('dist/assets/.gitkeep')))
    // doesn't break beta.16 projects
    .then(() => updateJsonFile('.speedray-cli.json', configJson => {
      const app = configJson['apps'][0];
      app['assets'] = 'assets';
    }))
    .then(() => expectFileToExist('dist/assets/.file'))
    .then(() => expectFileToMatch('dist/assets/test.abc', 'hello world'));
}
