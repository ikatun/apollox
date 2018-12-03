import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { kebabCase, map, upperFirst, values } from 'lodash';
import { join } from 'path';
import { getAllExistingQueries } from './get-all-existing-queries';

function secondIndexOf(ch: string, str: string) {
  const firstIndex = str.indexOf(ch);

  return str.indexOf(ch, firstIndex + 1);
}

function secondToLastIndexOf(ch: string, str: string) {
  const lastIndex = str.lastIndexOf(ch);

  return str.lastIndexOf(ch, lastIndex - 1);
}

function extractSelection(query: string) {
  const secondIndex = secondIndexOf('{', query);
  const secondToLastIndex = secondToLastIndexOf('}', query);

  return query.substring(secondIndex, secondToLastIndex + 1);
}

function tryReadingFile(filePath: string) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (e) {
    return '';
  }
}

const existingQueries: Array<string> = getAllExistingQueries(process.cwd()).map(q => q.queryName);

function generateTypescriptFiles(generatedGraphqlQueries: any) {
  map(generatedGraphqlQueries, (generatedQuery: string, generatedQueryName: string) => {
    const queryName = upperFirst(generatedQueryName);
    const query = generatedQuery.replace(generatedQueryName, queryName);

    const queryAlreadyExists = !!existingQueries
      .find(existingName => existingName.toLowerCase() === queryName.toLowerCase());

    if (queryAlreadyExists) {
      console.log(`skipping ${queryName} auto generation because it already exists`);

      return;
    }

    const secondIndex = secondIndexOf('{', query);
    const selectionPart = extractSelection(query);
    const resultFilePath = `src/graphql/generated-queries/${kebabCase(queryName)}-queries.ts`;
    const existingResultSelection = tryReadingFile(resultFilePath);

    const queryWithoutSelection = secondIndex === -1 ?
      query :
      query.replace(selectionPart, existingResultSelection || ' {\n        id\n    }');

    const cleanQuery = queryWithoutSelection
      .replace(/ {2}/g, ' ')
      .replace(/\n/g, '\n  ');

    const queryFileContent =
`/* tslint:disable:max-line-length */
import gql from 'graphql-tag';

export const ${queryName} = gql\`
  ${cleanQuery}
\`;
`;

    writeFileSync(resultFilePath, queryFileContent, { encoding: 'utf8' });
  });
}

const tmpFilesPath = join(process.cwd(), 'src/graphql/generated-queries/tmp');

execSync(`mkdir -p ${tmpFilesPath}`);
execSync(`npx gqlg --schemaFilePath schema.graphql --destDirPath ${tmpFilesPath}`);
const generatedGql = require(tmpFilesPath);
values(generatedGql).map(generateTypescriptFiles);
execSync(`rm -rf ${tmpFilesPath}`);
