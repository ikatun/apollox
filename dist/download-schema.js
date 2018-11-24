"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var util_1 = require("util");
var execAsync = util_1.promisify(child_process_1.exec);
var url = process.argv[3];
if (!url) {
    throw new Error('schema:download requires argument');
}
var command = "npx apollo schema:download --endpoint " + process.argv[3];
execAsync(command).then(function (_a) {
    var stderr = _a.stderr, stdout = _a.stdout;
    console.log(stdout);
    console.error(stderr);
});
