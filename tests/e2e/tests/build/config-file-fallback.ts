import {sr} from '../../utils/process';
import {moveFile} from '../../utils/fs';


export default function() {
  return Promise.resolve()
    .then(() => sr('build'))
    .then(() => moveFile('.angular-cli.json', 'angular-cli.json'))
    .then(() => sr('build'));
}
