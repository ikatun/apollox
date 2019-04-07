#!/usr/bin/env node
import path from 'path';
require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.json'),
});

if (process.argv[2] === 'generate:store') {
  require('./dist/generate-graphql-store.js');
} else if (process.argv[2] === 'generate:types') {
  require('./dist/generate-graphql-types.js');
} else if (process.argv[2] === 'schema:download') {
  require('./dist/download-schema.js');
} else if (process.argv[2] === 'schema:download:graphql') {
  require('./dist/download-schema-as-graphql.js');
} else if (process.argv[2] === 'generate:everything') {
  require('./dist/download-schema.js')
    .then(() => require('./dist/generate-graphql-types.js'))
    .then(() => require('./dist/generate-graphql-store.js'))
    .then(() => require('./dist/download-schema-as-graphql.js'));
} else if (process.argv[2] === 'generate:queries') {
  require('./dist/download-schema.js')
    .then(() => require('./dist/download-schema-as-graphql.js'))
    .then(() => require('./dist/convert-gql-to-ts.js'));
} else {
  throw new Error('argument expected: generate:store|generate:types|schema:download|generate:everything');
}
