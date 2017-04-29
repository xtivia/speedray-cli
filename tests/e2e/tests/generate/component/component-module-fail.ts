import {sr} from '../../../utils/process';
import {expectToFail} from '../../../utils/utils';


export default function() {
  return Promise.resolve()
    .then(() => expectToFail(() =>
      sr('generate', 'component', 'test-component', '--module', 'app.moduleXXX.ts')));
}
