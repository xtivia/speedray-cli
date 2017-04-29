import { sr } from '../../utils/process';
import { writeFile } from '../../utils/fs';
import { oneLine } from 'common-tags';

export default function () {
  const fileName = 'src/app/foo.ts';

  return Promise.resolve()
    .then(() => sr('set', 'lint.0.exclude', '"**/foo.ts"'))
    .then(() => writeFile(fileName, 'const foo = "";\n'))
    .then(() => sr('lint'))
    .then(({ stdout }) => {
      if (!stdout.match(/All files pass linting\./)) {
        throw new Error(oneLine`
          Expected to match "All files pass linting."
          in ${stdout}.
        `);
      }
    });
}
