"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var util_1 = require("util");
var execAsync = util_1.promisify(child_process_1.exec);
var url = process.argv[3];
if (!url) {
    throw new Error('schema:download:graphql requires argument');
}
var command = "npx graphql get-schema --endpoint " + url + " --output schema.graphql";
module.exports = execAsync(command).then(function (_a) {
    var stderr = _a.stderr, stdout = _a.stdout;
    console.log(stdout);
    console.error(stderr);
}).catch(function (e) {
    throw e;
});
