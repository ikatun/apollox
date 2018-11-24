#!/usr/bin/env node
require('ts-node').register();

if (process.argv[2] === 'generate:store') {
  require('./dist/generate-graphql-store.js');
} else if (process.argv[2] === 'generate:types') {
  require('./dist/generate-graphql-types.js');
} else if (process.argv[2] === 'schema:download') {
  require('./dist/download-schema.js');
} else if (process.argv[2] === 'generate:everything') {
  require('./dist/download-schema.js')
    .then(() => require('./dist/generate-graphql-types.js'))
    .then(() => require('./dist/generate-graphql-store.js'));
} else {
  throw new Error('argument expected: generate:store|generate:types|schema:download|generate:everything');
}
