const childProcess = require('child_process');
const fs = require('fs');

export function gradle(callback: Function) {
    if (fs.existsSync('liferay/build.gradle')) {
        const codegen = childProcess.spawn('gradle compileJava',
            { cwd: process.cwd() + '/liferay', shell: true });

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

export function watch(callback: Function) {
    if (fs.existsSync('liferay/build.gradle')) {
        fs.watch('liferay/src/main/java', { recursive: true }, () => {
                return gradle(callback);
        });
    }
}
