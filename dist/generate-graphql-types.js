"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var util_1 = require("util");
var execAsync = util_1.promisify(child_process_1.exec);
execAsync('npx apollo codegen:generate src/graphql/types.ts').then(function (_a) {
    var stderr = _a.stderr, stdout = _a.stdout;
    console.log(stdout);
    console.error(stderr);
});
