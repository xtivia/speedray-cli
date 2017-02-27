import * as rimraf from 'rimraf';
import * as path from 'path';
import { JarTaskOptions } from '../../commands/speedray-jar';
import { CliConfig } from '../../models/config';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

const fs = require('fs');
const archiver = require('archiver');
const replace = require('replace-in-file')

export function jar(project: any, options: JarTaskOptions): Observable<Number> {
    const subject = new ReplaySubject<Number>();
    const packageOptions = require(path.resolve(project.root, 'package.json'));
    const config = CliConfig.fromProject().config;

    var outputPath: string = path.resolve(project.root, options.outputPath);
    if(!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
    var jarPath: string = path.resolve(outputPath, 
            packageOptions.speedray['portlet-name']+'.'+packageOptions.version+'.jar');

    replace.sync({
    files: path.resolve(options.inputPath, '/src/main/resources/META-INF/MANIFEST.MF'),
        from: /Bnd-LastModified: .*/,
        to: 'Bnd-LastModified: '+Date.now()
    });

    var archive:any = archiver('zip');
    var output:any = fs.createWriteStream(jarPath);

    output.on('close', function() {
        subject.next(archive.pointer());
        subject.complete();
    });

    archive.on('error', (error:any) => {
        subject.error(error);
        subject.complete();
    });

    archive.pipe(output);

    archive.directory(options.inputPath+'/src/main/resources/META-INF','/META-INF')
        .directory(options.inputPath+'/src/main/resources/OSGI-INF','/OSGI-INF')
        .directory(options.inputPath+'/src/main/resources/content','/content')
        .directory(options.inputPath+'/dist','/META-INF/resources')
        .finalize();

    return subject.asObservable();
}