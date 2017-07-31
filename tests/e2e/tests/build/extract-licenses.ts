import {join} from 'path';
import {expectFileToExist} from '../../utils/fs';
import {expectToFail} from '../../utils/utils';
import {sr} from '../../utils/process';

export default function() {
  return sr('build', '--prod', '--extract-licenses=false')
    .then(() => expectFileToExist(join(process.cwd(), 'dist')))
    .then(() => expectToFail(() => expectFileToExist('dist/3rdpartylicenses.txt')));
}
