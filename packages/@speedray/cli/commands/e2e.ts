const SilentError = require('silent-error');

import { overrideOptions } from '../utilities/override-options';
import { CliConfig } from '../models/config';
import { DeployTaskOptions, baseDeployCommandOptions} from './deploy';
import { checkPort } from '../utilities/check-port';
const Command = require('../ember-cli/lib/models/command');


export interface E2eTaskOptions extends DeployTaskOptions {
  config: string;
  deploy: boolean;
  ssl: string;
  webdriverUpdate: boolean;
  specs: string[];
  elementExplorer: boolean;
}

const E2eCommand = Command.extend({
  name: 'e2e',
  aliases: ['e'],
  description: 'Run e2e tests in existing project',
  works: 'insideProject',
  availableOptions: overrideOptions(
    baseDeployCommandOptions.concat([
      { name: 'config', type: String, aliases: ['c'] },
      { name: 'specs', type: Array, default: [], aliases: ['sp'] },
      { name: 'element-explorer', type: Boolean, default: false, aliases: ['ee'] },
      { name: 'webdriver-update', type: Boolean, default: true, aliases: ['wu'] },
      { name: 'deploy', type: Boolean, default: true, aliases: ['d'] }
    ]), [
      { name: 'port', default: 0 },
      { name: 'watch', default: false },
    ]
  ),
  run: function (commandOptions: E2eTaskOptions) {
    const E2eTask = require('../tasks/e2e').E2eTask;
    this.project.ngConfig = this.project.ngConfig || CliConfig.fromProject();

    const e2eTask = new E2eTask({
      ui: this.ui,
      project: this.project
    });

    if (!commandOptions.config) {
      const e2eConfig = CliConfig.fromProject().config.e2e;

      if (!e2eConfig.protractor.config) {
        throw new SilentError('No protractor config found in .speedray-cli.json.');
      }

      commandOptions.config = e2eConfig.protractor.config;
    }

    if (commandOptions.deploy) {
      const DeployTask = require('../tasks/deploy').default;

      const deploy = new DeployTask({
        ui: this.ui,
        project: this.project,
      });

      // Protractor will end the proccess, so we don't need to kill the dev server
      return new Promise((resolve, reject) => {
        let firstRebuild = true;
        function rebuildCb() {
          // don't run re-run tests on subsequent rebuilds
          if (firstRebuild) {
            firstRebuild = false;
            return resolve(e2eTask.run(commandOptions));
          }
        }

        checkPort(commandOptions.port, commandOptions.host)
          .then((port: number) => commandOptions.port = port)
          .then(() => deploy.run(commandOptions, rebuildCb))
          .catch(reject);
      });
    } else {
      return e2eTask.run(commandOptions);
    }
  }
});


export default E2eCommand;
