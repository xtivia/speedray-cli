import * as rimraf from 'rimraf';
import * as path from 'path';
const Task = require('../../ember-cli/lib/models/task');
const SilentError = require('silent-error');
import { JarTaskOptions } from '../../commands/speedray/jar';
import { CliConfig } from '../../models/config';
const fs = require('fs');
const archiver = require('archiver');


export default Task.extend({
  run: function (runTaskOptions: JarTaskOptions) {

    const project = this.cliProject;
    const config = CliConfig.fromProject().config;

    const outputPath = runTaskOptions.outputPath || config.apps[0].outDir;
    if (project.root === outputPath) {
      throw new SilentError('Output path MUST not be project root directory!');
    }
    return new Promise((resolve, reject) => {
      var archive:any = archiver('zip');
      var output:any = fs.createWriteStream(path.resolve(project.root, runTaskOptions.outputPath,'portlet.jar'));

      output.on('close', function() {
        resolve();
      });

      archive.on('error',reject);

      archive.pipe(output);

      archive.append(runTaskOptions.inputPath);
    });
  }
});
