import { ApolloClient,  MutationOptions } from 'apollo-client';
import { extendObservable, toJS } from 'mobx';
import mobxApollo, { MobxApolloQuery, MobxApolloQueryOptions } from 'mobx-apollo';
import { withoutTypename } from './without-typename';
import fastMemoize from 'fast-memoize';

type MutationOptions1<T> = { [K in Exclude<keyof MutationOptions<T, {}>, 'variables'>]: MutationOptions<T, {}>[K] };
type MutationOptions2<T> = { [K in Exclude<keyof MutationOptions1<T>, 'mutation'>]: MutationOptions1<T>[K] };
type MutationOptions3<T> = Partial<MutationOptions2<T>> & {
  alertErrors?: boolean;
};

type QueryOptions1<T> = { [K in Exclude<keyof MobxApolloQueryOptions<T>, 'variables'>]: MobxApolloQueryOptions<T>[K] };
type QueryOptions2<T> = { [K in Exclude<keyof QueryOptions1<T>, 'client'>]: QueryOptions1<T>[K] };
type QueryOptions3<T> = { [K in Exclude<keyof QueryOptions2<T>, 'query'>]: QueryOptions2<T>[K] };
type QueryOptions4<T> = { [K in Exclude<keyof QueryOptions3<T>, 'onError'>]: QueryOptions3<T>[K] };
type QueryOptions5<T> = { [K in Exclude<keyof QueryOptions4<T>, 'onError'>]: QueryOptions4<T>[K] };
type QueryOptions6<T> = Partial<QueryOptions5<T>> & {
  alertErrors?: boolean;
};

export function createGraphqlClient<T>(client: ApolloClient<T>, defaultApiErrorHandler: (e: Error) => void) {
  const mutation = <TVariables, TResult>(graphqlMutation: any) =>
    async (variables: TVariables, options: MutationOptions3<TResult> = {}) => {
      const { alertErrors, ...apolloOptions } = options;
      try {
        const response = await client.mutate({
          variables,
          mutation: graphqlMutation,
          ...apolloOptions,
        });
        if (response.errors && response.errors.length) {
          throw response.errors[0];
        }
        if (!response.data) {
          throw new Error('Could not get data');
        }

        return response.data as TResult;
      } catch (e) {
        if (alertErrors) {
          defaultApiErrorHandler(e);
        }
        throw e;
      }
    };

  const query = <TVariables, TResult>(graphqlQuery: any) => {
    function createQuery(variables: TVariables, options: QueryOptions6<TResult> = {}): MobxApolloQuery<TResult> {
      const { alertErrors, ...mobxApolloOptions } = options;

      const observableQuery = mobxApollo<TResult>({
        client,
        query: graphqlQuery,
        variables,
        ...mobxApolloOptions,
        onError(error) {
          if (alertErrors) {
            defaultApiErrorHandler(error);
          }
        },
      });

      const result = {
        ref: observableQuery.ref,
      };
      extendObservable(result, {
        get loading() { return observableQuery.loading; },
        get data() {
          if (observableQuery.loading || observableQuery.error) {
            return undefined;
          }

          return withoutTypename(toJS(observableQuery.data));
        },
        get error() { return observableQuery.error; },
      });

      return result as typeof observableQuery;
    }

    return fastMemoize(createQuery);
  };

  return { mutation, query };
}

export { withoutTypename };
