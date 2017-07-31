import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';

export default function() {
  return sr('build', '--aot')
    .then(() => expectFileToMatch('dist/main.bundle.js',
      /bootstrapModuleFactory.*\/\* AppModuleNgFactory \*\//));
}
