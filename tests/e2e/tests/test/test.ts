import { sr } from '../../utils/process';
import { moveFile } from '../../utils/fs';

export default function () {
  // make sure both --watch=false and --single-run work
  return sr('test', '--single-run')
    .then(() => sr('test', '--watch=false'))
    .then(() => moveFile('./karma.conf.js', './karma.conf.bis.js'))
    .then(() => sr('test', '--single-run', '--config', 'karma.conf.bis.js'));
}
