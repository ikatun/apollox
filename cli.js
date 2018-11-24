#!/usr/bin/env node

if (process.argv[2] === 'generate:store') {
  require('./dist/generate-graphql-store');
} else {
  throw new Error('generate:store argument expected');
}
