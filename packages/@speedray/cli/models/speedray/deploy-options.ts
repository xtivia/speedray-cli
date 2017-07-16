import { SpeedrayJarOptions } from './jar-options';

export interface SpeedrayDeployOptions extends SpeedrayJarOptions {
    host?: string;
    port?: number;
}
