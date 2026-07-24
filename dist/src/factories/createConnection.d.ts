import type { MaybePromiseType, ClientConfigurationType, ConnectionTypeType, DatabasePoolType, DatabasePoolConnectionType, InternalDatabaseConnectionType, InternalDatabasePoolType, Logger, TaggedTemplateLiteralInvocationType } from '../types';
type ConnectionHandlerType = (connectionLog: Logger, connection: InternalDatabaseConnectionType, boundConnection: DatabasePoolConnectionType, clientConfiguration: ClientConfigurationType) => MaybePromiseType<unknown>;
type PoolHandlerType = (pool: DatabasePoolType) => Promise<unknown>;
export declare const createConnection: (parentLog: Logger, pool: InternalDatabasePoolType, clientConfiguration: ClientConfigurationType, connectionType: ConnectionTypeType, connectionHandler: ConnectionHandlerType, poolHandler: PoolHandlerType, query?: TaggedTemplateLiteralInvocationType | null) => Promise<any>;
export {};
