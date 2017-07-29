import { Version } from '@angular/cli/upgrade/version';
import { SpeedrayJarOptions } from '../models/jar-options';
import { baseBuildCommandOptions } from '@angular/cli/commands/build';

const Command = require('@angular/cli/ember-cli/lib/models/command');

// defaults for BuildOptions
export const baseJarCommandOptions: any = baseBuildCommandOptions.concat([
  { name: 'output-jar-path', type: 'Path', default: 'dist', aliases: ['ojp'] },
  { name: 'input-jar-path', type: 'Path', default: 'liferay', aliases: ['ijp'] }
]);

export interface JarTaskOptions extends SpeedrayJarOptions {
}

const JarCommand = Command.extend({
  name: 'jar',
  description: 'Create a portlet jar for deployment to Liferay DXP',
  aliases: ['j'],

  availableOptions: baseJarCommandOptions.concat([
  ]),


  run: function (commandOptions: JarTaskOptions) {
    const project = this.project;

    // Check angular version.
    Version.assertAngularVersionIs2_3_1OrHigher(project.root);

    const JarTask = require('../tasks/speedray/jar').default;

    const jarTask = new JarTask({
      cliProject: project,
      ui: this.ui,
    });

    return jarTask.run(commandOptions);
  }
});

export default JarCommand;
