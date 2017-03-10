import { JarTaskOptions } from '../../commands/jar';
import { CliConfig } from '../../models/config';
import { jar } from '../../lib/speedray/jar';

const Task = require('../../ember-cli/lib/models/task');
const SilentError = require('silent-error');

export default Task.extend({
  run: function (runTaskOptions: JarTaskOptions, rebuildDoneCb: any) {
    const BuildTask = require('../build').default;
    const project = this.cliProject;
    const config = CliConfig.fromProject().config;
    return new Promise((resolve, reject) => {
      const buildTask = new BuildTask({
        cliProject: project,
        ui: this.ui
      });
      let self = this;
      if (runTaskOptions.watch) {
        buildTask.run(runTaskOptions, function rebuildDone(err: any, stats: any) {
          if (err) {
            return reject(err);
          }
          jar(project, runTaskOptions).subscribe(written => {
            if (rebuildDoneCb) {
              rebuildDoneCb(stats);
            } else {
              self.ui.writeLine('\nupdated jar with ' + written + ' bytes\n');
            }
          }, error => {
              reject(error);
          });
        }).catch((error: any) => {
          reject(error);
        });
      } else {
        buildTask.run(runTaskOptions).then((results: any) => {
          jar(project, runTaskOptions).subscribe(written => {
            self.ui.writeLine('\nupdated jar with ' + written + ' bytes\n');
            resolve(results);
          }, error => {
            reject(error);
          });
        }).catch((error: any) => {
          reject(error);
        });
      }
    });
  }
});
