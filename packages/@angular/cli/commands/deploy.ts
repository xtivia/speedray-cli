import { SpeedrayDeployOptions } from '../models/speedray/deploy-options';
import { CliConfig } from '../models/config';
import { Version } from '../upgrade/version';
import { baseJarCommandOptions } from './jar'

const Command = require('../ember-cli/lib/models/command');

const config = CliConfig.fromProject() || CliConfig.fromGlobal();
const pollDefault = config.config.defaults && config.config.defaults.poll;

// defaults for BuildOptions
export const baseDeployCommandOptions: any = baseJarCommandOptions.concat([
  { name: 'host', type: String, default: '127.0.0.1', aliases: ['h'] },
  { name: 'port', type: Number, default: 11311, aliases: ['p'] }
]);

export interface DeployTaskOptions extends SpeedrayDeployOptions {
}

const DeployCommand = Command.extend({
  name: 'deploy',
  description: 'Deploy a portlet jar to Liferay DXP',

  availableOptions: baseDeployCommandOptions.concat([
  ]),


  run: function (commandOptions: DeployTaskOptions) {
    const project = this.project;

    // Check angular version.
    Version.assertAngularVersionIs2_3_1OrHigher(project.root);

    const DeployTask = require('../tasks/speedray/deploy').default;

    const deployTask = new DeployTask({
      cliProject: project,
      ui: this.ui,
    });

    return deployTask.run(commandOptions);
  }
});

export default DeployCommand;