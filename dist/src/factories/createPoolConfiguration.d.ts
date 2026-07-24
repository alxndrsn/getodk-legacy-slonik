import type { ConnectionOptions } from 'pg-connection-string';
import type { ClientConfigurationType } from '../types';
export declare const createPoolConfiguration: (connectionUri: string, clientConfiguration: ClientConfigurationType) => ConnectionOptions;
