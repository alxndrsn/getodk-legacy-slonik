import type { ClientConfigurationType, DatabaseTransactionConnectionType, InternalDatabaseConnectionType, Logger } from '../types';
export declare const bindTransactionConnection: (parentLog: Logger, connection: InternalDatabaseConnectionType, clientConfiguration: ClientConfigurationType, transactionDepth: number) => DatabaseTransactionConnectionType;
