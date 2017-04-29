import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';

export default function() {
  return sr('build', '--aot')
    .then(() => expectFileToMatch('liferay/dist/main.*.bundle.js',
      /bootstrapModuleFactory.*\/\* AppModuleNgFactory \*\//));
}
