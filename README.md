# apollox
MobX graphql client

## Commands:

### apollox download:schema url
  Downloads graphql schema to `schema.json` file using `https://www.npmjs.com/package/apollo`

### apollox generate:types
  Creates typescript types for all queries inside the project against `schema.json` schema.
  Queries must be written inside `*queries.ts` files using `gql` literal and exported as variables.

### apollox generate:store
  Generates `src/graphql/graphql-store.ts` MobX store containing all the queries and mutations.

### apollox generate:everything url
  Executes `download:schema`, `generate:types` and `generate:store`.
