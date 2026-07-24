import type { ClientConfigurationType, DatabasePoolConnectionType, InternalDatabaseConnectionType, Logger } from '../types';
export declare const bindPoolConnection: (parentLog: Logger, connection: InternalDatabaseConnectionType, clientConfiguration: ClientConfigurationType) => DatabasePoolConnectionType;
