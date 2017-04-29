import { expectFileToMatch } from '../../utils/fs';
import { sr } from '../../utils/process';
import { oneLineTrim } from 'common-tags';

export default function () {
  return Promise.resolve()
    .then(() => sr('build'))
    // files were created successfully
    .then(() => expectFileToMatch('dist/polyfills.bundle.js', 'core-js'))
    .then(() => expectFileToMatch('dist/polyfills.bundle.js', 'zone.js'))
    // index.html lists the right bundles
    .then(() => expectFileToMatch('dist/index.html', oneLineTrim`
      <script type="text/javascript" src="inline.bundle.js"></script>
      <script type="text/javascript" src="polyfills.bundle.js"></script>
    `));
}
