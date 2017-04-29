import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';


export default function() {
  const modulePath = join('src', 'app', 'app.module.ts');

  return sr('generate', 'directive', 'test-directive', '--export')
    .then(() => expectFileToMatch(modulePath, 'exports: [TestDirectiveDirective]'))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
