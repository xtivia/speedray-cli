import { sr, setupProject } from '../helpers';

describe('Acceptance: sr destroy', () => {
  setupProject();

  it('without args should fail', (done) => {
    return sr(['destroy'])
      .then(() => done.fail())
      .catch(error => {
        expect(error.message).toBe('The destroy command is not supported by Speedray CLI.');
        done();
      });
  });

  it('with args should fail', (done) => {
    return sr(['destroy', 'something'])
      .then(() => done.fail())
      .catch(error => {
        expect(error.message).toBe('The destroy command is not supported by Speedray CLI.');
        done();
      });
  });
});
