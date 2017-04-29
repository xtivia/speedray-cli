import {sr} from '../../utils/process';
import * as fs from '../../utils/fs';


const options = {
  encoding: 'utf8'
};


export default function() {
  return Promise.resolve()
    .then(() => fs.prependToFile('./src/tsconfig.app.json', '\ufeff', options))
    .then(() => fs.prependToFile('./.speedray-cli.json', '\ufeff', options))
    .then(() => sr('build', '--env=dev'));
}
