import {ng} from '../../utils/process';
import {moveFile} from '../../utils/fs';


export default function() {
  return Promise.resolve()
    .then(() => ng('build'))
    .then(() => moveFile('.speedray-cli.json', '.speedray-cli.json'))
    .then(() => ng('build'));
}
