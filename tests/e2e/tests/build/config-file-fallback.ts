import {sr} from '../../utils/process';
import {moveFile} from '../../utils/fs';


export default function() {
  return Promise.resolve()
    .then(() => sr('build'))
    .then(() => moveFile('.speedray-cli.json', '.speedray-cli.json'))
    .then(() => sr('build'));
}
