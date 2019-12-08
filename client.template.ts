export default `
import ApolloClient from 'apollo-boost'
import { createGraphqlClient } from 'apollox'

export const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  async request(operation: any) {
    // const { token } = loginStore
    // if (token) {
    //   const headers = { Authorization: \`Bearer \${token}\` }
    //   operation.setContext({ headers })
    // }
  },
});

export const { mutation, query } = createGraphqlClient(client, console.error);
`;
