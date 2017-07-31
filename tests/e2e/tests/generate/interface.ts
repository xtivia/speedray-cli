import {join} from 'path';
import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';


export default function() {
  const interfaceDir = join('src', 'app');

  return sr('generate', 'interface', 'test-interface', 'model')
    .then(() => expectFileToExist(interfaceDir))
    .then(() => expectFileToExist(join(interfaceDir, 'test-interface.model.ts')))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
