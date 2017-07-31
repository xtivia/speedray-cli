import { createProjectFromAsset } from '../../utils/assets';
import { sr } from '../../utils/process';

// This test ensures a project generated with 1.0.0 will still work.
// Only change it test on major releases.

export default function () {
  return Promise.resolve()
    .then(() => createProjectFromAsset('1.0.0-proj'))
    .then(() => sr('generate', 'component', 'my-comp'))
    .then(() => sr('lint'))
    .then(() => sr('test', '--single-run'))
    .then(() => sr('e2e'))
    .then(() => sr('e2e', '--prod'));
}
