import { ApolloClient, MutationOptions } from 'apollo-client';
import { MobxApolloQuery, MobxApolloQueryOptions } from 'mobx-apollo';
declare type MutationOptions1<T> = {
    [K in Exclude<keyof MutationOptions<T, {}>, 'variables'>]: MutationOptions<T, {}>[K];
};
declare type MutationOptions2<T> = {
    [K in Exclude<keyof MutationOptions1<T>, 'mutation'>]: MutationOptions1<T>[K];
};
declare type MutationOptions3<T> = Partial<MutationOptions2<T>> & {
    alertErrors?: boolean;
};
declare type QueryOptions1<T> = {
    [K in Exclude<keyof MobxApolloQueryOptions<T>, 'variables'>]: MobxApolloQueryOptions<T>[K];
};
declare type QueryOptions2<T> = {
    [K in Exclude<keyof QueryOptions1<T>, 'client'>]: QueryOptions1<T>[K];
};
declare type QueryOptions3<T> = {
    [K in Exclude<keyof QueryOptions2<T>, 'query'>]: QueryOptions2<T>[K];
};
declare type QueryOptions4<T> = {
    [K in Exclude<keyof QueryOptions3<T>, 'onError'>]: QueryOptions3<T>[K];
};
declare type QueryOptions5<T> = {
    [K in Exclude<keyof QueryOptions4<T>, 'onError'>]: QueryOptions4<T>[K];
};
declare type QueryOptions6<T> = Partial<QueryOptions5<T>> & {
    alertErrors?: boolean;
};
export declare function createGraphqlClient(client: ApolloClient<any>, defaultApiErrorHandler: (e: Error) => void): {
    mutation: <TVariables, TResult>(graphqlMutation: any) => (variables: TVariables, options?: MutationOptions3<TResult>) => Promise<TResult>;
    query: <TVariables, TResult>(graphqlQuery: any) => (variables: TVariables, options?: QueryOptions6<TResult>) => MobxApolloQuery<TResult>;
};
export {};
