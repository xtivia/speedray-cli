import {updateTsConfig} from '../../utils/project';
import {sr} from '../../utils/process';
import {getGlobalVariable} from '../../utils/env';


export default function() {
  // Skip this in Appveyor tests.
  if (getGlobalVariable('argv').appveyor) {
    return Promise.resolve();
  }

  return updateTsConfig(json => {
    json['compilerOptions']['noImplicitAny'] = true;
  })
  .then(() => sr('build'));
}
