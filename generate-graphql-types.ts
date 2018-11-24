import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const command = "npx apollo codegen:generate src/graphql/types.ts --schema schema.json --target typescript --outputFlat --queries 'src/**/**queries.ts'";

module.exports = execAsync(command).then(({ stderr, stdout }) => {
  console.log(stdout);
  console.error(stderr);
});
