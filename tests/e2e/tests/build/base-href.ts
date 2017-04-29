import {sr} from '../../utils/process';
import {expectFileToMatch} from '../../utils/fs';


export default function() {
  return sr('build', '--base-href', '/myUrl')
    .then(() => expectFileToMatch('dist/index.html', /<base href="\/myUrl">/));
}
