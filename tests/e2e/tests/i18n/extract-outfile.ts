import {join} from 'path';
import {sr} from '../../utils/process';
import {
  expectFileToExist, writeFile,
  expectFileToMatch
} from '../../utils/fs';


export default function() {
  return sr('generate', 'component', 'i18n-test')
    .then(() => writeFile(
      join('src/app/i18n-test', 'i18n-test.component.html'),
      '<p i18n>Hello world</p>'))
    .then(() => sr('xi18n', '--out-file', 'messages.fr.xlf'))
    .then((output) => {
      if (!output.stdout.match(/starting from Angular v4/)) {
        expectFileToExist(join('src', 'messages.fr.xlf'));
        expectFileToMatch(join('src', 'messages.fr.xlf'), /Hello world/);
      }
    });
}
