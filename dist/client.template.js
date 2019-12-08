"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "\nimport ApolloClient from 'apollo-boost'\nimport { createGraphqlClient } from 'apollox'\n\nexport const client = new ApolloClient({\n  uri: 'http://localhost:5000/graphql',\n  async request(operation: any) {\n    // const { token } = loginStore\n    // if (token) {\n    //   const headers = { Authorization: `Bearer ${token}` }\n    //   operation.setContext({ headers })\n    // }\n  },\n});\n\nexport const { mutation, query } = createGraphqlClient(client, console.error);\n";
