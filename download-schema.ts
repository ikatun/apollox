import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const url = process.argv[3];
if (!url) {
  throw new Error('schema:download requires argument');
}

const command = `npx apollo schema:download --endpoint ${url}`;

execAsync(command).then(({ stderr, stdout }) => {
  console.log(stdout);
  console.error(stderr);
}).catch((e) => {
  throw e;
});
