import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';
import {expectToFail} from '../../utils/utils';


export default function() {
  return sr('build')
    .then(() => expectFileToExist('liferay/dist/main.*.bundle.js.map'))

    .then(() => sr('build', '--no-sourcemap'))
    .then(() => expectToFail(() => expectFileToExist('liferay/dist/main.*.bundle.js.map')))

    .then(() => sr('build', '--prod', '--output-hashing=none'))
    .then(() => expectToFail(() => expectFileToExist('liferay/dist/main.*.bundle.js.map')))

    .then(() => sr('build', '--prod', '--output-hashing=none', '--sourcemap'))
    .then(() => expectFileToExist('liferay/dist/main.*.bundle.js.map'));
}
