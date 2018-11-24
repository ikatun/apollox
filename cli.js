#!/usr/bin/env node
require('ts-node/register');

if (process.argv[2] === 'generate:store') {
  require('./generate-graphql-store');
} else {
  throw new Error('generate:store argument expected');
}
