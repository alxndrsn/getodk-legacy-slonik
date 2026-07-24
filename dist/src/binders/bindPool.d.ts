import type { ClientConfigurationType, DatabasePoolType, InternalDatabasePoolType, Logger } from '../types';
export declare const bindPool: (parentLog: Logger, pool: InternalDatabasePoolType, clientConfiguration: ClientConfigurationType) => DatabasePoolType;
