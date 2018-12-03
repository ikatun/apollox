export interface IQueryInfo {
    queryName: string;
    exportName: string;
    filePath: string;
    variablesType: string;
    operationType: string;
}
export declare function getAllExistingQueries(rootPath: string): IQueryInfo[];
