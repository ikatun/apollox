import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const url = process.argv[3];
if (!url) {
  throw new Error('schema:download:graphql requires argument');
}

const command = `npx graphql get-schema --endpoint ${url} --output graphq.graphql`;

module.exports = execAsync(command).then(({ stderr, stdout }) => {
  console.log(stdout);
  console.error(stderr);
}).catch((e) => {
  throw e;
});
