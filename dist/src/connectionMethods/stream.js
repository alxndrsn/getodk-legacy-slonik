"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const through2_1 = __importDefault(require("through2"));
const QueryStream_1 = require("../QueryStream");
const errors_1 = require("../errors");
const routines_1 = require("../routines");
const stream = async (connectionLogger, connection, clientConfiguration, rawSql, values, streamHandler, opts) => {
    return (0, routines_1.executeQuery)(connectionLogger, connection, clientConfiguration, rawSql, values, undefined, (finalConnection, finalSql, finalValues, executionContext, actualQuery) => {
        if (connection.connection.slonik.native) {
            throw new errors_1.UnexpectedStateError('Result cursors do not work with the native driver. Use JavaScript driver.');
        }
        const query = new QueryStream_1.QueryStream(finalSql, finalValues, opts);
        const queryStream = finalConnection.query(query);
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
            const transformedStream = queryStream.pipe(through2_1.default.obj(function (datum, enc, callback) {
                let finalRow = datum.row;
                if (rowTransformers.length) {
                    for (const rowTransformer of rowTransformers) {
                        finalRow = rowTransformer(executionContext, actualQuery, finalRow, datum.fields);
                    }
                }
                // eslint-disable-next-line fp/no-this
                this.push({
                    fields: datum.fields,
                    row: finalRow,
                });
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