import { JarTaskOptions } from '../../commands/jar';
import { CliConfig } from '../../models/config';
import { jar } from '../../lib/speedray/jar';

const Task = require('../../ember-cli/lib/models/task');
const SilentError = require('silent-error');


export default Task.extend({
  run: function (runTaskOptions: JarTaskOptions) {
    const BuildTask = require('../build').default;
    const project = this.cliProject;
    const config = CliConfig.fromProject().config;
    return new Promise((resolve, reject) => {
      const buildTask = new BuildTask({
        cliProject: project,
        ui: this.ui
      });
      buildTask.run(runTaskOptions).then((results:any)=>{
        jar(project, runTaskOptions).subscribe(written => {
          resolve(written);
        }, error => {
          reject(error);
        });          
      }).catch((error:any)=>{
        reject(error);
      });
    });
  }
});
