import {deleteFile} from '../../utils/fs';
import {sr} from '../../utils/process';


export default function() {
  return sr('version')
    .then(() => deleteFile('.angular-cli.json'))
    // doesn't fail on a project with missing .angular-cli.json
    .then(() => sr('version'));
}
