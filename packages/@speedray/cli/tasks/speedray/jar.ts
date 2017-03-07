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
      if(runTaskOptions.watch) {
        buildTask.run(runTaskOptions, function rebuildDone(err: any, stats: any) {
          if (err) {
            return reject(err);
          }
          jar(project, runTaskOptions).subscribe(written => {
            if(rebuildDoneCb) {
              rebuildDoneCb(written);
            } else {
              self.ui.writeLine('\nA new version of the portlet JAR was created\n');
            }
          }, error => {
              reject(error);
          });  
        }).catch((error:any)=>{
          reject(error);
        });
      } else {
        buildTask.run(runTaskOptions).then((results:any)=>{
          jar(project, runTaskOptions).subscribe(written => {
            self.ui.writeLine('\nA new version of the portlet JAR was created\n');
            resolve(written);
          }, error => {
            reject(error);
          });          
        }).catch((error:any)=>{
          reject(error);
        });
      }
    });
  }
});
