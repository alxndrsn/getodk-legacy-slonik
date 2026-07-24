import { Readable } from 'stream';
/**
 * @see https://github.com/brianc/node-pg-query-stream
 * @see https://github.com/brianc/node-pg-query-stream/issues/51
 */
export declare class QueryStream extends Readable {
    _reading: boolean;
    _closed: boolean;
    _result: any;
    cursor: any;
    batchSize: number;
    handleRowDescription: Function;
    handlePortalSuspended: Function;
    handleDataRow: Function;
    handleCommandComplete: Function;
    handleReadyForQuery: Function;
    handleError: Function;
    constructor(text: any, values: any, options?: any);
    submit(connection: any): void;
    _destroy(error: Error, callback: Function): void;
    _read(size: number): void;
}
