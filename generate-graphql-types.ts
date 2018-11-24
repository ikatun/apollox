import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

execAsync('npx apollo codegen:generate src/graphql/types.ts').then(({ stderr, stdout }) => {
  console.log(stdout);
  console.error(stderr);
});
