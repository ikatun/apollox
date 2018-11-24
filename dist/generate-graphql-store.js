"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var glob_1 = require("glob");
var lodash_1 = require("lodash");
var path_1 = require("path");
var rootPath = process.cwd();
var typesContent = fs.readFileSync(rootPath + "/src/graphql/types.ts", 'utf8');
var withoutExtension = function (x) { return x.substring(0, x.lastIndexOf('.')); };
var toNodePath = function (x) { return x.startsWith('.') ? x : "./" + x; };
function getOperationName(queryInstance) {
    var operationDefinition = queryInstance.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })[0];
    return operationDefinition.name.value;
}
function getOperationType(queryInstance) {
    var operationDefinition = queryInstance.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })[0];
    return operationDefinition.operation;
}
var queriesFiles = glob_1.sync(rootPath + "/src/**/*queries.ts");
var allQueries = queriesFiles.map(function (filePath) {
    // tslint:disable-next-line
    return lodash_1.map(require(filePath), function (queryInstance, exportName) {
        var queryName = getOperationName(queryInstance);
        var variablesType = queryName + "Variables";
        return {
            queryName: queryName,
            exportName: exportName,
            filePath: filePath,
            variablesType: typesContent.includes(variablesType) ? "T." + variablesType : '{}',
            operationType: getOperationType(queryInstance),
        };
    });
});
var allQueriesArray = lodash_1.flatten(lodash_1.flatten(allQueries));
var generateQueryImport = function (q) {
    return "import { " + q.exportName + " } from '" + toNodePath(path_1.relative(rootPath + "/src/graphql/", withoutExtension(q.filePath))) + "';";
};
var generateQueryStore = function (q) {
    return "  public " + lodash_1.lowerFirst(q.queryName) + " = " + q.operationType + "<" + q.variablesType + ", T." + q.queryName + ">(" + q.exportName + ");";
};
var generateStoreContent = function () {
    return "/*** THIS FILE US AUTOGENERATED USING apollox, DON'T EDIT IT MANUALLY ***/\n\n/* tslint:disable */\nimport { mutation, query } from './client';\nimport * as T from './types';\n\n" + allQueriesArray.map(generateQueryImport).join('\n') + "\n\nexport class GraphqlStore {\n" + allQueriesArray.map(generateQueryStore).join('\n') + "\n}\n\nexport const graphqlStore = new GraphqlStore();";
};
console.log(generateStoreContent());
