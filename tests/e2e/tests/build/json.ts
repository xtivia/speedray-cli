import {sr} from '../../utils/process';
import {expectFileToExist} from '../../utils/fs';
import {expectGitToBeClean} from '../../utils/git';
import {getGlobalVariable} from '../../utils/env';


export default function() {
  // Skip this in ejected tests.
  if (getGlobalVariable('argv').eject) {
    return Promise.resolve();
  }

  return sr('build', '--stats-json')
    .then(() => expectFileToExist('./dist/stats.json'))
    .then(() => expectGitToBeClean());
}
