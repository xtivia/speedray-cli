import {join} from 'path';
import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';


export default function() {
  const classDir = join('src', 'app');

  return sr('generate', 'class', 'test-class', '--spec')
    .then(() => expectFileToExist(classDir))
    .then(() => expectFileToExist(join(classDir, 'test-class.ts')))
    .then(() => expectFileToExist(join(classDir, 'test-class.spec.ts')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
