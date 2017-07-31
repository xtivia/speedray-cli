import {sr} from '../../utils/process';
import {expectToFail} from '../../utils/utils';


export default function() {
  return Promise.resolve()
    .then(() => expectToFail(() =>
      sr('generate', 'component', '1my-component')));
}
