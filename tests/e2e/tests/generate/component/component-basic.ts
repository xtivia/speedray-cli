import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToExist} from '../../../utils/fs';


export default function() {
  const componentDir = join('src', 'app', 'test-component');

  return sr('generate', 'component', 'test-component')
    .then(() => expectFileToExist(componentDir))
    .then(() => expectFileToExist(join(componentDir, 'test-component.component.ts')))
    .then(() => expectFileToExist(join(componentDir, 'test-component.component.spec.ts')))
    .then(() => expectFileToExist(join(componentDir, 'test-component.component.html')))
    .then(() => expectFileToExist(join(componentDir, 'test-component.component.css')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
