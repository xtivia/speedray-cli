import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';
import {expectToFail} from '../../utils/utils';


export default function() {
  return sr('build')
    .then(() => expectFileToExist('dist/vendor.bundle.js'))
    .then(() => sr('build', '--no-vendor-chunk'))
    .then(() => expectToFail(() => expectFileToExist('dist/vendor.bundle.js')));
}
