import { DeployTaskOptions } from '../../commands/deploy';
import { CliConfig } from '../../models/config';
import { deploy } from '../../lib/speedray/deploy';

const Task = require('../../ember-cli/lib/models/task');
const SilentError = require('silent-error');


export default Task.extend({
  run: function (runTaskOptions: DeployTaskOptions, rebuildDoneCb: any) {
    const JarTask = require('./jar').default;
    const project = this.cliProject;
    const config = CliConfig.fromProject().config;
    return new Promise((resolve, reject) => {
        const jarTask = new JarTask({
          cliProject: project,
          ui: this.ui
        });
        let self = this;
        if(runTaskOptions.watch) {
          jarTask.run(runTaskOptions, function rebuildDone(written: any) {
            deploy(project, runTaskOptions).subscribe(results => {
              if(rebuildDoneCb) {
                rebuildDoneCb(written);
              } else {
                self.ui.writeLine(results);
              }
            }, error => {
              self.ui.writeError('\nAn error occured during the deployment:\n' + (error));
              reject(error);
            });
          }).catch((error:any)=>{
            reject(error);
          });
        } else {
          jarTask.run(runTaskOptions).then((results:any)=>{
            deploy(project, runTaskOptions).subscribe(results => {
              self.ui.writeLine(results);
              resolve(results);
            }, error => {
              self.ui.writeError('\nAn error occured during the deployment:\n' + (error));
              reject(error);
            });
          }).catch((error:any)=>{
            reject(error);
          });
      }
    });
  }
});
