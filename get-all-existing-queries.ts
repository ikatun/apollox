import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { flatten, map } from 'lodash';

function getOperationName(queryInstance: any) {
  const operationDefinition = queryInstance.definitions.filter((d: any) => d.kind === 'OperationDefinition')[0];

  return operationDefinition && operationDefinition.name.value;
}

function getOperationType(queryInstance: any) {
  const operationDefinition = queryInstance.definitions.filter((d: any) => d.kind === 'OperationDefinition')[0];

  return operationDefinition.operation;
}

export interface IQueryInfo {
  queryName: string;
  exportName: string;
  filePath: string;
  variablesType: string;
  operationType: string;
}

export function getAllExistingQueries(rootPath: string) {
  const queriesFiles = globSync(`${rootPath}/src/**/*queries.ts`);
  const typesContent = fs.readFileSync(`${rootPath}/src/graphql/types.ts`, 'utf8');

  const allQueries = queriesFiles.map((filePath: string) =>
// tslint:disable-next-line
      map(require(filePath), (queryInstance: any, exportName: string): IQueryInfo | undefined => {
        const queryName = getOperationName(queryInstance);
        if (!queryName) {
          return undefined;
        }
        const variablesType = `${queryName}Variables`;

        return {
          queryName,
          exportName,
          filePath,
          variablesType: typesContent.includes(` ${variablesType}`) ? `T.${variablesType}` : '{}',
          operationType: getOperationType(queryInstance),
        };
      }),
  );

  return flatten(flatten(allQueries)).filter(q => q).map(q => q!);
}
