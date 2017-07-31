const sr: ((parameters: string[]) => Promise<any>) = require('./sr');
const tmp = require('./tmp');

export function setupProject() {
  beforeEach((done) => {
    spyOn(console, 'error');

    tmp.setup('./tmp')
      .then(() => process.chdir('./tmp'))
      .then(() => sr(['new', 'foo', '--skip-install']))
      .then(done, done.fail);
  }, 10000);

  afterEach((done) => {
    tmp.teardown('./tmp').then(done, done.fail);
  });
}

export {
  sr
};
