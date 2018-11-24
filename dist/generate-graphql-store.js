"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var glob_1 = require("glob");
var lodash_1 = require("lodash");
var path_1 = require("path");
var rootPath = process.cwd();
module.exports = (function () { return __awaiter(_this, void 0, void 0, function () {
    function getOperationName(queryInstance) {
        var operationDefinition = queryInstance.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })[0];
        return operationDefinition.name.value;
    }
    function getOperationType(queryInstance) {
        var operationDefinition = queryInstance.definitions.filter(function (d) { return d.kind === 'OperationDefinition'; })[0];
        return operationDefinition.operation;
    }
    var typesContent, withoutExtension, toNodePath, queriesFiles, allQueries, allQueriesArray, generateQueryImport, generateQueryStore, generateStoreContent;
    return __generator(this, function (_a) {
        typesContent = fs.readFileSync(rootPath + "/src/graphql/types.ts", 'utf8');
        withoutExtension = function (x) { return x.substring(0, x.lastIndexOf('.')); };
        toNodePath = function (x) { return x.startsWith('.') ? x : "./" + x; };
        queriesFiles = glob_1.sync(rootPath + "/src/**/*queries.ts");
        allQueries = queriesFiles.map(function (filePath) {
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
        allQueriesArray = lodash_1.flatten(lodash_1.flatten(allQueries));
        generateQueryImport = function (q) {
            return "import { " + q.exportName + " } from '" + toNodePath(path_1.relative(rootPath + "/src/graphql/", withoutExtension(q.filePath))) + "';";
        };
        generateQueryStore = function (q) {
            return "  public " + lodash_1.lowerFirst(q.queryName) + " = " + q.operationType + "<" + q.variablesType + ", T." + q.queryName + ">(" + q.exportName + ");";
        };
        generateStoreContent = function () {
            return "/*** THIS FILE US AUTOGENERATED BY apollox, DON'T EDIT IT MANUALLY ***/\n\n/* tslint:disable */\nimport { mutation, query } from './client';\nimport * as T from './types';\n\n" + allQueriesArray.map(generateQueryImport).join('\n') + "\n\nexport class GraphqlStore {\n" + allQueriesArray.map(generateQueryStore).join('\n') + "\n}\n\nexport const graphqlStore = new GraphqlStore();";
        };
        fs.writeFileSync('./src/graphql/graphql-store.ts', generateStoreContent(), 'utf8');
        console.log('src/graphql/graphql-store.ts generated');
        return [2 /*return*/];
    });
}); })();
