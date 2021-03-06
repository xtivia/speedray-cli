import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToExist} from '../../../utils/fs';
import {updateJsonFile} from '../../../utils/project';


export default function() {
  const appDir = join('src', 'app');

  return Promise.resolve()
    .then(() => updateJsonFile('.speedray-cli.json', configJson => {
      const comp = configJson.defaults.component;
      comp.flat = true;
    }))
    .then(() => sr('generate', 'component', 'test-component'))
    .then(() => expectFileToExist(appDir))
    .then(() => expectFileToExist(join(appDir, 'test-component.component.ts')))
    .then(() => expectFileToExist(join(appDir, 'test-component.component.spec.ts')))
    .then(() => expectFileToExist(join(appDir, 'test-component.component.html')))
    .then(() => expectFileToExist(join(appDir, 'test-component.component.css')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
