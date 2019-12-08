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
function getOperationName(queryInstance) {
    var operationDefinition = queryInstance.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })[0];
    return operationDefinition && operationDefinition.name.value;
}
function getOperationType(queryInstance) {
    var operationDefinition = queryInstance.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })[0];
    return operationDefinition.operation;
}
function getAllExistingQueries(rootPath) {
    var queriesFiles = glob_1.sync(rootPath + "/src/**/*queries.ts");
    var typesPath = rootPath + "/src/graphql/types.ts";
    if (!fs.existsSync(typesPath)) {
        return [];
    }
    var typesContent = fs.readFileSync(typesPath, 'utf8');
    var allQueries = queriesFiles.map(function (filePath) {
        // tslint:disable-next-line
        return lodash_1.map(require(filePath), function (queryInstance, exportName) {
            var queryName = getOperationName(queryInstance);
            if (!queryName) {
                return undefined;
            }
            var variablesType = queryName + "Variables";
            return {
                queryName: queryName,
                exportName: exportName,
                filePath: filePath,
                variablesType: typesContent.includes(" " + variablesType) ? "T." + variablesType : '{}',
                operationType: getOperationType(queryInstance),
            };
        });
    });
    return lodash_1.flatten(lodash_1.flatten(allQueries)).filter(function (q) { return q; }).map(function (q) { return q; });
}
exports.getAllExistingQueries = getAllExistingQueries;
