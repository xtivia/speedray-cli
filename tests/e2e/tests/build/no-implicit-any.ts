import {updateTsConfig} from '../../utils/project';
import {sr} from '../../utils/process';


export default function() {
  return updateTsConfig(json => {
    json['compilerOptions']['noImplicitAny'] = true;
  })
  .then(() => sr('build'));
}
