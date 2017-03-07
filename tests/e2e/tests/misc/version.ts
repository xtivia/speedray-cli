import {deleteFile} from '../../utils/fs';
import {ng} from '../../utils/process';


export default function() {
  return ng('version')
    .then(() => deleteFile('.speedray-cli.json'))
    // doesn't fail on a project with missing .speedray-cli.json
    .then(() => ng('version'));
}
