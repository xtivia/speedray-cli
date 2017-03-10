import * as rimraf from 'rimraf';
import * as path from 'path';
import { JarTaskOptions } from '../../commands/jar';
import { CliConfig } from '../../models/config';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

const fs = require('fs');
const archiver = require('archiver');
const replace = require('replace-in-file');

export function jar(project: any, options: JarTaskOptions): Observable<Number> {
    const subject = new ReplaySubject<Number>();
    const packageOptions = require(path.resolve(project.root, 'package.json'));
    const config = CliConfig.fromProject().config;

    const outputPath: string = path.resolve(project.root, options.outputJarPath);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
    const jarPath: string = path.resolve(outputPath, packageOptions.name + '.' +
            packageOptions.version + '.jar');
    replace.sync({
        files: path.resolve(options.inputJarPath, '/src/main/resources/META-INF/MANIFEST.MF'),
            from: /Bnd-LastModified: .*/,
            to: 'Bnd-LastModified: ' + Date.now()
    });
    const archive: any = archiver('zip');
    const output: any = fs.createWriteStream(jarPath);
    output.on('close', function() {
        subject.next(archive.pointer());
        subject.complete();
    });
    archive.on('error', (error: any) => {
        subject.error(error);
        subject.complete();
    });
    archive.pipe(output);
    archive.directory(options.inputJarPath + '/src/main/resources/META-INF', '/META-INF')
        .directory(options.inputJarPath + '/src/main/resources/OSGI-INF', '/OSGI-INF')
        .directory(options.inputJarPath + '/src/main/resources/content', '/content')
        .directory(options.inputJarPath + '/dist', '/META-INF/resources')
        .finalize();
    return subject.asObservable();
}
