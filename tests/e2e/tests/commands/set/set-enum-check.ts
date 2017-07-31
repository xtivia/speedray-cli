import {sr} from '../../../utils/process';
import {expectToFail} from '../../../utils/utils';

export default function() {
  return Promise.resolve()
    .then(() => expectToFail(() => sr('set', 'defaults.component.aaa', 'bbb')))
    .then(() => expectToFail(() => sr('set', 'defaults.component.viewEncapsulation', 'bbb')))
    .then(() => sr('set', 'defaults.component.viewEncapsulation', 'Emulated'));
}
