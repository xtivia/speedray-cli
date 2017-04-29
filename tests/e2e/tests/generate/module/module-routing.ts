import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToExist} from '../../../utils/fs';
import {expectToFail} from '../../../utils/utils';


export default function() {
  const moduleDir = join('src', 'app', 'test');

  return sr('generate', 'module', 'test', '--routing')
    .then(() => expectFileToExist(moduleDir))
    .then(() => expectFileToExist(join(moduleDir, 'test.module.ts')))
    .then(() => expectFileToExist(join(moduleDir, 'test-routing.module.ts')))
    .then(() => expectToFail(() => expectFileToExist(join(moduleDir, 'test.spec.ts'))))
    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
