import * as fs from 'fs-extra';
import { join } from 'path';
import { sr } from '../../../utils/process';
import { expectFileToExist } from '../../../utils/fs';
import { expectToFail } from '../../../utils/utils';


export default function () {
  const root = process.cwd();
  const testPath = join(root, 'src', 'app');

  process.chdir(testPath);
  fs.mkdirSync('./sub-dir');

  return Promise.resolve()
    .then(() =>
      sr('generate', 'module', 'sub-dir/child', '--routing')
        .then(() => expectFileToExist(join(testPath, 'sub-dir/child')))
        .then(() => expectFileToExist(join(testPath, 'sub-dir/child', 'child.module.ts')))
        .then(() => expectFileToExist(join(testPath, 'sub-dir/child', 'child-routing.module.ts')))
        .then(() => expectToFail(() =>
          expectFileToExist(join(testPath, 'sub-dir/child', 'child.spec.ts'))
        ))
        // Try to run the unit tests.
        .then(() => sr('test', '--single-run'))
    );
}
