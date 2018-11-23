"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var objectKeyFilter = require('object-key-filter');
function withoutTypename(data) {
    return typeof data === 'object' ? objectKeyFilter(data, ['__typename'], true) : data;
}
exports.withoutTypename = withoutTypename;
