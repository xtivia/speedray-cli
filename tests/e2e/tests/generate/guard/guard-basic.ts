import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToExist} from '../../../utils/fs';


export default function() {
  // Does not create a sub directory.
  const guardDir = join('src', 'app');

  return sr('generate', 'guard', 'test-guard')
    .then(() => expectFileToExist(guardDir))
    .then(() => expectFileToExist(join(guardDir, 'test-guard.guard.ts')))
    .then(() => expectFileToExist(join(guardDir, 'test-guard.guard.spec.ts')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
