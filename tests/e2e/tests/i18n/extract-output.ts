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
    .then(() => sr('xi18n', '--output-path', 'src/locale'))
    .then(() => expectFileToExist(join('src', 'locale', 'messages.xlf')))
    .then(() => expectFileToMatch(join('src', 'locale', 'messages.xlf'), /Hello world/));
}
