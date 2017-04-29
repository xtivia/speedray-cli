import { sr } from '../../utils/process';
import { replaceInFile } from "../../utils/fs";


export default function() {
  return Promise.resolve()
    .then(() => replaceInFile('src/app/app.component.ts',
      '@Component({',
      '@Component({ moduleId: module.id,'))
    .then(() => sr('build'));
}
