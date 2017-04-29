import {oneLine} from 'common-tags';
import * as fs from 'fs';

import {sr} from '../../utils/process';
import {writeFile} from '../../utils/fs';
import {addImportToModule} from '../../utils/ast';

const OUTPUT_RE = /(main|polyfills|vendor|inline|styles|\d+)\.[a-z0-9]+\.(chunk|bundle)\.(js|css)$/;

function generateFileHashMap(): Map<string, string> {
  const hashes = new Map<string, string>();

  fs.readdirSync('./dist')
    .forEach(name => {
      if (!name.match(OUTPUT_RE)) {
        return;
      }

      const [module, hash] = name.split('.');
      hashes.set(module, hash);
    });

  return hashes;
}

function validateHashes(
  oldHashes: Map<string, string>,
  newHashes: Map<string, string>,
  shouldChange: Array<string>): void {

  console.log('  Validating hashes...');
  console.log(`  Old hashes: ${JSON.stringify([...oldHashes])}`);
  console.log(`  New hashes: ${JSON.stringify([...newHashes])}`);

  oldHashes.forEach((hash, module) => {
      if (hash == newHashes.get(module)) {
        if (shouldChange.includes(module)) {
          throw new Error(`Module "${module}" did not change hash (${hash})...`);
        }
      } else if (!shouldChange.includes(module)) {
        throw new Error(`Module "${module}" changed hash (${hash})...`);
      }
    });
}

export default function() {
  let oldHashes: Map<string, string>;
  let newHashes: Map<string, string>;
  // First, collect the hashes.
  return Promise.resolve()
    .then(() => sr('generate', 'module', 'lazy', '--routing'))
    .then(() => addImportToModule('src/app/app.module.ts', oneLine`
      RouterModule.forRoot([{ path: "lazy", loadChildren: "./lazy/lazy.module#LazyModule" }])
    `, '@angular/router'))
    .then(() => addImportToModule(
      'src/app/app.module.ts', 'ReactiveFormsModule', '@angular/forms'))
    .then(() => sr('build', '--prod'))
    .then(() => {
      oldHashes = generateFileHashMap();
    })
    .then(() => sr('build', '--prod'))
    .then(() => {
      newHashes = generateFileHashMap();
    })
    .then(() => {
      validateHashes(oldHashes, newHashes, []);
      oldHashes = newHashes;
    })
    .then(() => writeFile('src/styles.css', 'body { background: blue; }'))
    .then(() => sr('build', '--prod'))
    .then(() => {
      newHashes = generateFileHashMap();
    })
    .then(() => {
      validateHashes(oldHashes, newHashes, ['styles']);
      oldHashes = newHashes;
    })
    .then(() => writeFile('src/app/app.component.css', 'h1 { margin: 10px; }'))
    .then(() => sr('build', '--prod'))
    .then(() => {
      newHashes = generateFileHashMap();
    })
    .then(() => {
      validateHashes(oldHashes, newHashes, ['inline', 'main']);
      oldHashes = newHashes;
    })
    .then(() => addImportToModule(
      'src/app/lazy/lazy.module.ts', 'ReactiveFormsModule', '@angular/forms'))
    .then(() => sr('build', '--prod'))
    .then(() => {
      newHashes = generateFileHashMap();
    })
    .then(() => {
      validateHashes(oldHashes, newHashes, ['inline', '0']);
    });
}
