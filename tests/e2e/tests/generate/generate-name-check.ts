import {join} from 'path';
import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';
import {updateJsonFile} from '../../utils/project';


export default function() {
  const compDir = join('src', 'app', 'test-component');

  return Promise.resolve()
    .then(() => updateJsonFile('package.json', configJson => {
      delete configJson.name;
      return configJson;
    }))
    .then(() => sr('generate', 'component', 'test-component'))
    .then(() => expectFileToExist(compDir))
    .then(() => expectFileToExist(join(compDir, 'test-component.component.ts')))
    .then(() => expectFileToExist(join(compDir, 'test-component.component.spec.ts')))
    .then(() => expectFileToExist(join(compDir, 'test-component.component.html')))
    .then(() => expectFileToExist(join(compDir, 'test-component.component.css')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
