import { sr } from '../../utils/process';
import { oneLine } from 'common-tags';

export default function () {
  return Promise.resolve()
    .then(() => sr('set', 'lint', '[]'))
    .then(() => sr('lint'))
    .then(({ stdout }) => {
      if (!stdout.match(/No lint config\(s\) found\./)) {
        throw new Error(oneLine`
          Expected to match "No lint configs found."
          in ${stdout}.
        `);
      }

      return stdout;
    })
    .then((output) => {
      if (!output.match(/If this is not intended, run "sr update"\./)) {
        throw new Error(oneLine`
          Expected to match "If this is not intended, run "sr update"."
          in ${output}.
        `);
      }

      return output;
    });
}
