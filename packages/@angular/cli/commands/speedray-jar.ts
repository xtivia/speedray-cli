import { CliConfig } from '../models/config';
import { Version } from '../upgrade/version';
import { SpeedrayJarOptions } from '../models/speedray/jar-options';

const Command = require('../ember-cli/lib/models/command');

const config = CliConfig.fromProject() || CliConfig.fromGlobal();
const pollDefault = config.config.defaults && config.config.defaults.poll;

// defaults for BuildOptions
export const baseJarCommandOptions: any = [
  { name: 'output-path', type: 'Path', default: 'dist', aliases: ['op'] },
  { name: 'input-path', type: 'Path', default: 'liferay', aliases: ['ip'] },
  { name: 'gogo-port', type: Number, default: 11311, aliases: ['gp'] }
];

export interface JarTaskOptions extends SpeedrayJarOptions {
}

const JarCommand = Command.extend({
  name: 'speedray-jar',
  description: 'Create a portlet jar for deployment to Liferay DXP',
  aliases: ['s-j'],

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
