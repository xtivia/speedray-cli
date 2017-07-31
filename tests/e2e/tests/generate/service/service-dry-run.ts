import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectGitToBeClean} from '../../../utils/git';


export default function() {
  return sr('generate', 'service', 'test-service', '--module', 'app.module.ts', '--dry-run')
    .then(() => expectGitToBeClean());
}
