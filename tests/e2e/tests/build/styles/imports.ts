import {
  writeMultipleFiles,
  expectFileToMatch,
  replaceInFile
} from '../../../utils/fs';
import { expectToFail } from '../../../utils/utils';
import { sr } from '../../../utils/process';
import { stripIndents } from 'common-tags';
import { updateJsonFile } from '../../../utils/project';
import { getGlobalVariable } from '../../../utils/env';

export default function () {
  // Disable parts of it in webpack tests.
  const ejected = getGlobalVariable('argv').eject;

  const extensions = ['css', 'scss', 'less', 'styl'];
  let promise = Promise.resolve();

  extensions.forEach(ext => {
    promise = promise.then(() => {
      return writeMultipleFiles({
        [`src/styles.${ext}`]: stripIndents`
          @import './imported-styles.${ext}';
          body { background-color: #00f; }
        `,
        [`src/imported-styles.${ext}`]: stripIndents`
          p { background-color: #f00; }
        `,
        [`src/app/app.component.${ext}`]: stripIndents`
          @import './imported-component-styles.${ext}';
          .outer {
            .inner {
              background: #fff;
            }
          }
        `,
        [`src/app/imported-component-styles.${ext}`]: stripIndents`
          h1 { background: #000; }
        `})
        // change files to use preprocessor
        .then(() => updateJsonFile('.speedray-cli.json', configJson => {
          const app = configJson['apps'][0];
          app['styles'] = [`styles.${ext}`];
        }))
        .then(() => replaceInFile('src/app/app.component.ts',
          './app.component.css', `./app.component.${ext}`))
        // run build app
        .then(() => sr('build', '--extract-css', '--sourcemap'))
        // verify global styles
        .then(() => expectFileToMatch('dist/styles.bundle.css',
          /body\s*{\s*background-color: #00f;\s*}/))
        .then(() => expectFileToMatch('dist/styles.bundle.css',
          /p\s*{\s*background-color: #f00;\s*}/))
        // verify global styles sourcemap
        .then(() => expectToFail(() =>
          expectFileToMatch('dist/styles.bundle.css', '"mappings":""')))
        // verify component styles
        .then(() => expectFileToMatch('liferay/dist/main.*.bundle.js',
          /.outer.*.inner.*background:\s*#[fF]+/))
        .then(() => expectFileToMatch('liferay/dist/main.*.bundle.js',
          /h1.*background:\s*#000+/))
        // Also check imports work on sr test
        .then(() => !ejected && sr('test', '--single-run'))
        // change files back
        .then(() => updateJsonFile('.speedray-cli.json', configJson => {
          const app = configJson['apps'][0];
          app['styles'] = ['styles.css'];
        }))
        .then(() => replaceInFile('src/app/app.component.ts',
          `./app.component.${ext}`, './app.component.css'));
    });
  });

  return promise;
}
