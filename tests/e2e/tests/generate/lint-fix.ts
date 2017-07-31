import { sr } from '../../utils/process';
import { writeFile } from '../../utils/fs';
import { expectToFail } from '../../utils/utils';

export default function () {
  const nestedConfigContent = `
  {
    "rules": {
      "quotemark": [
        true,
        "double",
        "avoid-escape"
      ]
    }
  }`;

  return Promise.resolve()
    // setup a double-quote tslint config
    .then(() => writeFile('src/app/tslint.json', nestedConfigContent))

    // Generate a fixed new component but don't fix rest of app
    .then(() => sr('generate', 'component', 'test-component1', '--lint-fix'))
    .then(() => expectToFail(() => sr('lint')))

    // Fix rest of app and generate new component
    .then(() => sr('lint', '--fix'))
    .then(() => sr('generate', 'component', 'test-component2', '--lint-fix'))
    .then(() => sr('lint'))

    // Enable default option and generate all other module related blueprints
    .then(() => sr('set', 'defaults.lintFix', 'true'))
    .then(() => sr('generate', 'directive', 'test-directive'))
    .then(() => sr('generate', 'service', 'test-service', '--module', 'app.module.ts'))
    .then(() => sr('generate', 'pipe', 'test-pipe'))
    .then(() => sr('generate', 'guard', 'test-guard', '--module', 'app.module.ts'))
    .then(() => sr('lint'));
}
