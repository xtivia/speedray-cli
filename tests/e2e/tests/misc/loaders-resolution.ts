import { createDir, moveFile } from '../../utils/fs';
import { sr } from '../../utils/process';

export default async function () {
  await createDir('node_modules/@angular/cli/node_modules');
  await moveFile(
    'node_modules/@ngtools',
    'node_modules/@angular/cli/node_modules/@ngtools'
  );

  await sr('build');
}
