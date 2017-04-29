import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';


export default function() {
  const modulePath = join('src', 'app', 'app.module.ts');

  return sr('generate', 'pipe', 'test-pipe', '--module', 'app.module.ts')
    .then(() => expectFileToMatch(modulePath,
      /import { TestPipePipe } from '.\/test-pipe.pipe'/))

    // Try to run the unit tests.
    .then(() => sr('build'));
}
