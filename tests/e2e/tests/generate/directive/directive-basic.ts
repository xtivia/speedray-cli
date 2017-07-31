import {sr} from '../../../utils/process';
import {join} from 'path';
import {expectFileToExist} from '../../../utils/fs';


export default function() {
  const directiveDir = join('src', 'app');
  return sr('generate', 'directive', 'test-directive')
    .then(() => expectFileToExist(join(directiveDir, 'test-directive.directive.ts')))
    .then(() => expectFileToExist(join(directiveDir, 'test-directive.directive.spec.ts')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
