import * as path from 'path';
import { DeployTaskOptions } from '../../commands/deploy';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { jar } from './jar';

export function deploy(project: any, options: DeployTaskOptions): Observable<string> {
    const subject = new ReplaySubject<string>();
    const packageOptions = require(path.resolve(project.root, 'package.json'));
    const Gogo = require('./gogo-deploy').GogoDeployer;

    let outputPath: string = path.resolve(project.root, options.outputJarPath);
    let jarPath: string = path.resolve(outputPath, packageOptions.name + '.jar');

    jar(project, options).subscribe(() => {
        let gogo = new Gogo({connectConfig: { host: options.host, port: options.port }});
        gogo.on('error', (error: any) => {
            subject.error(error);
            subject.complete();
        });
        gogo.deploy(jarPath, packageOptions.name).then((data: string) => {
            gogo.destroy();
            subject.next(data);
            subject.complete();
        });
    }, error => {
        subject.error(error);
        subject.complete();
    });

    return subject.asObservable();
}
