"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var path_1 = require("path");
var get_all_existing_queries_1 = require("./get-all-existing-queries");
function secondIndexOf(ch, str) {
    var firstIndex = str.indexOf(ch);
    return str.indexOf(ch, firstIndex + 1);
}
function secondToLastIndexOf(ch, str) {
    var lastIndex = str.lastIndexOf(ch);
    return str.lastIndexOf(ch, lastIndex - 1);
}
function extractSelection(query) {
    var secondIndex = secondIndexOf('{', query);
    var secondToLastIndex = secondToLastIndexOf('}', query);
    return query.substring(secondIndex, secondToLastIndex + 1);
}
function tryReadingFile(filePath) {
    try {
        return fs_1.readFileSync(filePath, 'utf8');
    }
    catch (e) {
        return '';
    }
}
var existingQueries = get_all_existing_queries_1.getAllExistingQueries(process.cwd()).map(function (q) { return q.queryName; });
function generateTypescriptFiles(generatedGraphqlQueries) {
    lodash_1.map(generatedGraphqlQueries, function (generatedQuery, generatedQueryName) {
        var queryName = lodash_1.upperFirst(generatedQueryName);
        var query = generatedQuery.replace(generatedQueryName, queryName);
        var queryAlreadyExists = !!existingQueries
            .find(function (existingName) { return existingName.toLowerCase() === queryName.toLowerCase(); });
        if (queryAlreadyExists) {
            console.log("skipping " + queryName + " auto generation because it already exists");
            return;
        }
        var secondIndex = secondIndexOf('{', query);
        var selectionPart = extractSelection(query);
        var resultFilePath = "src/graphql/generated-queries/" + lodash_1.kebabCase(queryName) + "-queries.ts";
        var existingResultSelection = tryReadingFile(resultFilePath);
        var queryWithoutSelection = secondIndex === -1 ?
            query :
            query.replace(selectionPart, existingResultSelection || ' {\n        id\n    }');
        var cleanQuery = queryWithoutSelection
            .replace(/ {2}/g, ' ')
            .replace(/\n/g, '\n  ');
        var queryFileContent = "/* tslint:disable:max-line-length */\nimport gql from 'graphql-tag';\n\nexport const " + queryName + " = gql`\n  " + cleanQuery + "\n`;\n";
        fs_1.writeFileSync(resultFilePath, queryFileContent, { encoding: 'utf8' });
    });
}
var tmpFilesPath = path_1.join(process.cwd(), 'src/graphql/generated-queries/tmp');
child_process_1.execSync("mkdir -p " + tmpFilesPath);
child_process_1.execSync("npx gqlg --schemaFilePath schema.graphql --destDirPath " + tmpFilesPath);
var generatedGql = require(tmpFilesPath);
lodash_1.values(generatedGql).map(generateTypescriptFiles);
child_process_1.execSync("rm -rf " + tmpFilesPath);
