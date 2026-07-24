"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const through2_1 = __importDefault(require("through2"));
const pg_query_stream_1 = __importDefault(require("pg-query-stream"));
const errors_1 = require("../errors");
const routines_1 = require("../routines");
const stream = async (connectionLogger, connection, clientConfiguration, rawSql, values, streamHandler, opts) => {
    return (0, routines_1.executeQuery)(connectionLogger, connection, clientConfiguration, rawSql, values, undefined, (finalConnection, finalSql, finalValues, executionContext, actualQuery) => {
        if (connection.connection.slonik.native) {
            throw new errors_1.UnexpectedStateError('Result cursors do not work with the native driver. Use JavaScript driver.');
        }
        const query = new pg_query_stream_1.default(finalSql, finalValues, opts);
        const isArrayMode = (opts === null || opts === void 0 ? void 0 : opts.rowMode) === 'array';
        const queryStream = finalConnection.query(query);
        let fields;
        if (!isArrayMode)
            finalConnection.connection.once('rowDescription', (rowDescription) => {
                fields = rowDescription.fields.map((f) => ({
                    name: f.name,
                    dataTypeId: f.dataTypeID,
                }));
            });
        const rowTransformers = [];
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.transformRow) {
                rowTransformers.push(interceptor.transformRow);
            }
        }
        return new Promise((resolve, reject) => {
            queryStream.on('error', (error) => {
                reject(error);
            });
            const transformedStream = queryStream.pipe(through2_1.default.obj(function (row, enc, callback) {
                let finalRow = row;
                if (rowTransformers.length) {
                    for (const rowTransformer of rowTransformers) {
                        finalRow = rowTransformer(executionContext, actualQuery, finalRow, fields);
                    }
                }
                if (isArrayMode) {
                    this.push(row);
                }
                else {
                    // eslint-disable-next-line fp/no-this
                    this.push({
                        fields,
                        row: finalRow,
                    });
                }
                callback();
            }));
            transformedStream.on('end', () => {
                // @ts-expect-error
                resolve({});
            });
            // Invoked if stream is destroyed using transformedStream.destroy().
            transformedStream.on('close', () => {
                if (!queryStream.destroyed) {
                    queryStream.destroy();
                }
                // @ts-expect-error
                resolve({});
            });
            transformedStream.on('error', (error) => {
                queryStream.destroy(error);
            });
            transformedStream.once('readable', () => {
                streamHandler(transformedStream);
            });
        });
    });
};
exports.stream = stream;
//# sourceMappingURL=stream.js.map