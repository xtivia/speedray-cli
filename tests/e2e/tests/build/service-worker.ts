import {join} from 'path';
import {getGlobalVariable} from '../../utils/env';
import {expectFileToExist, expectFileToMatch} from '../../utils/fs';
import {sr, npm} from '../../utils/process';

export default function() {
  // Skip this in ejected tests.
  if (getGlobalVariable('argv').eject) {
    return Promise.resolve();
  }

  // Can't use the `sr` helper because somewhere the environment gets
  // stuck to the first build done
  return npm('install', '@angular/service-worker')
    .then(() => sr('set', 'apps.0.serviceWorker=true'))
    .then(() => sr('build', '--prod'))
    .then(() => expectFileToExist(join(process.cwd(), 'dist')))
    .then(() => expectFileToExist(join(process.cwd(), 'dist/ngsw-manifest.json')))
    .then(() => sr('build', '--prod', '--base-href=/foo/bar'))
    .then(() => expectFileToExist(join(process.cwd(), 'dist/ngsw-manifest.json')))
    .then(() => expectFileToMatch('dist/ngsw-manifest.json', /"\/foo\/bar\/index.html"/));
}
