import * as path from 'path';

import {sr, silentNpm, exec} from '../../../utils/process';
import {expectToFail} from '../../../utils/utils';
import {expectGitToBeClean} from '../../../utils/git';


export default function() {
  return sr('eject')
    .then(() => expectToFail(() => sr('build')))
    .then(() => expectToFail(() => sr('test')))
    .then(() => expectToFail(() => sr('e2e')))
    .then(() => expectToFail(() => sr('serve')))
    .then(() => expectToFail(() => expectGitToBeClean()))
    .then(() => silentNpm('install'))
    .then(() => exec(path.join('node_modules', '.bin', 'webpack')));
}
