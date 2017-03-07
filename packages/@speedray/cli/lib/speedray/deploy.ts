import * as path from 'path';
import { DeployTaskOptions } from '../../commands/deploy';
import { CliConfig } from '../../models/config';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { jar } from './jar'

export function deploy(project: any, options: DeployTaskOptions): Observable<string> {
    const subject = new ReplaySubject<string>();
    const packageOptions = require(path.resolve(project.root, 'package.json'));
    const config = CliConfig.fromProject().config;
    const Gogo = require('./gogo-deploy').GogoDeployer;

    var outputPath: string = path.resolve(project.root, options.outputPath);
    var jarPath: string = path.resolve(outputPath, 
            packageOptions.name+'.'+packageOptions.version+'.jar');

    jar(project, options).subscribe(written => {
        let gogo = new Gogo({connectConfig:{ host: options.host, port: options.port }});
        gogo.on('error', (error:any) => {
            subject.error(error);
            subject.complete();
        });
        gogo.deploy(jarPath, packageOptions.name).then((data:string) => {
            gogo.destroy();
            subject.next(data);
            subject.complete();
        });
    }, error => {
        subject.error(error);
        subject.complete();
    })

    return subject.asObservable();
}