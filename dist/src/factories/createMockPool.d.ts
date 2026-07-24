import type { ClientConfigurationInputType, DatabasePoolType, PrimitiveValueExpressionType, QueryResultRowType, QueryResultType } from '../types';
type OverridesType = {
    readonly query: (sql: string, values: readonly PrimitiveValueExpressionType[]) => Promise<QueryResultType<QueryResultRowType>>;
};
export declare const createMockPool: (overrides: OverridesType, clientConfigurationInput?: ClientConfigurationInputType) => DatabasePoolType;
export {};
