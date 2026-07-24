import type { ClientConfigurationType, InternalDatabaseConnectionType, Logger, PrimitiveValueExpressionType, QueryContextType, QueryIdType, QueryResultRowType, QueryResultType, QueryType } from '../types';
type GenericQueryResult = QueryResultType<QueryResultRowType>;
type ExecutionRoutineType = (connection: InternalDatabaseConnectionType, sql: string, values: readonly PrimitiveValueExpressionType[], queryContext: QueryContextType, query: QueryType) => Promise<GenericQueryResult>;
export declare const executeQuery: (connectionLogger: Logger, connection: InternalDatabaseConnectionType, clientConfiguration: ClientConfigurationType, rawSql: string, values: readonly PrimitiveValueExpressionType[], inheritedQueryId?: QueryIdType, executionRoutine?: ExecutionRoutineType) => Promise<QueryResultType<Record<string, PrimitiveValueExpressionType>>>;
export {};
