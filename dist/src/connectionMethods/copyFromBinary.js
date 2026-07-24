"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFromBinary = void 0;
const stream_1 = require("stream");
const pg_copy_streams_1 = require("pg-copy-streams");
const errors_1 = require("../errors");
const routines_1 = require("../routines");
const utilities_1 = require("../utilities");
const bufferToStream = (buffer) => {
    const stream = new stream_1.Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
const copyFromBinary = async (connectionLogger, connection, clientConfiguration, rawSql, boundValues, tupleList, columnTypes) => {
    if (connection.connection.slonik.native) {
        throw new errors_1.UnexpectedStateError('COPY streams do not work with the native driver. Use JavaScript driver.');
    }
    const payloadBuffer = await (0, utilities_1.encodeTupleList)(tupleList, columnTypes);
    return (0, routines_1.executeQuery)(connectionLogger, connection, clientConfiguration, rawSql, boundValues, undefined, (finalConnection, finalSql) => {
        const copyFromBinaryStream = finalConnection.query((0, pg_copy_streams_1.from)(finalSql));
        bufferToStream(payloadBuffer).pipe(copyFromBinaryStream);
        return new Promise((resolve, reject) => {
            copyFromBinaryStream.on('error', (error) => {
                reject(error);
            });
            copyFromBinaryStream.on('end', () => {
                // @ts-expect-error
                resolve({});
            });
        });
    });
};
exports.copyFromBinary = copyFromBinary;
//# sourceMappingURL=copyFromBinary.js.map