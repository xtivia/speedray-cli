const childProcess = require('child_process');
const fs = require('fs');

export function generate(yaml: string, output: string, callback: Function) {
    if (fs.existsSync(yaml)) {
        const codegen = childProcess.spawn('java', [
            '-jar', __dirname + '/../../bin/swagger-codegen-cli.jar', 'generate', '-i', yaml, '-l',
            'typescript-angular2', '-o', output
        ]);

        codegen.stdout.on('data', (data: string) => {
            console.log(data.toString());
        });

        codegen.stderr.on('data', (data: string) => {
            console.error(data.toString());
        });

        codegen.on('close', (code: number) => {
            if (callback) {
                if (code && code === 0) {
                    return callback();
                }
                return callback(code);
            }
        });
    } else {
        if (callback) {
            return callback();
        }
    }
}

export function watch(yaml: string, output: string, callback: Function) {
    if (fs.existsSync(yaml)) {
        generate(yaml, output, (code: any) => {
            if (code) {
                return callback(code);
            }
            fs.watch(yaml, (_: string, filename: string) => {
                    return generate(filename, output, callback);
            });
        });
    }
}
