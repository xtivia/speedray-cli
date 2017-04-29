import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToExist, expectFileToMatch} from '../../../utils/fs';
import {expectToFail} from '../../../utils/utils';


export default function() {
  const moduleDir = join('src', 'app', 'test');

  return sr('generate', 'module', 'test')
    .then(() => expectFileToExist(moduleDir))
    .then(() => expectFileToExist(join(moduleDir, 'test.module.ts')))
    .then(() => expectToFail(() => expectFileToExist(join(moduleDir, 'test-routing.module.ts'))))
    .then(() => expectToFail(() => expectFileToExist(join(moduleDir, 'test.spec.ts'))))
    .then(() => expectFileToMatch(join(moduleDir, 'test.module.ts'), 'TestModule'))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
