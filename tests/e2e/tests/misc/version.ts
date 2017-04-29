import {deleteFile} from '../../utils/fs';
import {sr} from '../../utils/process';


export default function() {
  return sr('version')
    .then(() => deleteFile('.speedray-cli.json'))
    // doesn't fail on a project with missing .speedray-cli.json
    .then(() => sr('version'));
}
