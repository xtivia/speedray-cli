import * as rimraf from 'rimraf';
import * as path from 'path';
import { JarTaskOptions } from '../../commands/speedray-jar';
import { CliConfig } from '../../models/config';

const Task = require('../../ember-cli/lib/models/task');
const SilentError = require('silent-error');
const fs = require('fs');
const archiver = require('archiver');
const replace = require('replace-in-file')


export default Task.extend({
  run: function (runTaskOptions: JarTaskOptions) {

    const project = this.cliProject;
    const config = CliConfig.fromProject().config;
    const packageOptions = require(path.resolve(project.root, 'package.json'));


    const outputPath = runTaskOptions.outputPath || config.apps[0].outDir;
    return new Promise((resolve, reject) => {
      var outputPath: string = path.resolve(project.root, runTaskOptions.outputPath);
      if(!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }
      var jarPath: string = path.resolve(outputPath,
        packageOptions.speedray['portlet-name']+'.'+packageOptions.version+'.jar');

      replace.sync({
        files: path.resolve(project.root, 'liferay/src/main/resources/META-INF/MANIFEST.MF'),
        from: /Bnd-LastModified: .*/,
        to: 'Bnd-LastModified: '+Date.now()
      });

      var archive:any = archiver('zip');
      var output:any = fs.createWriteStream(jarPath);

      output.on('close', function() {
        resolve();
      });

      archive.on('error',reject);

      archive.pipe(output);

      archive.directory(runTaskOptions.inputPath+'/src/main/resources/META-INF','/META-INF')
        .directory(runTaskOptions.inputPath+'/src/main/resources/OSGI-INF','/OSGI-INF')
        .directory(runTaskOptions.inputPath+'/src/main/resources/content','/content')
        .directory(runTaskOptions.inputPath+'/dist','/META-INF/resources')
        .finalize();
    });
  }
});
