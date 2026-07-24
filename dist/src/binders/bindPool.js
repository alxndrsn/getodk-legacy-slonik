"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPool = void 0;
const assertions_1 = require("../assertions");
const connectionMethods_1 = require("../connectionMethods");
const factories_1 = require("../factories");
const bindPool = (parentLog, pool, clientConfiguration) => {
    const mapConnection = (targetMethodName) => {
        return (query) => {
            if (typeof query === 'string') {
                throw new TypeError('Query must be constructed using `sql` tagged template literal.');
            }
            return (0, factories_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', (connectionLog, connection, boundConnection) => {
                return boundConnection[targetMethodName](query);
            }, (newPool) => {
                return newPool[targetMethodName](query);
            }, query);
        };
    };
    return {
        any: mapConnection('any'),
        anyFirst: mapConnection('anyFirst'),
        configuration: clientConfiguration,
        connect: (connectionHandler) => {
            return (0, factories_1.createConnection)(parentLog, pool, clientConfiguration, 'EXPLICIT', (connectionLog, connection, boundConnection) => {
                return connectionHandler(boundConnection);
            }, (newPool) => {
                return newPool.connect(connectionHandler);
            });
        },
        copyFromBinary: (copyQuery, values, columnTypes) => {
            (0, assertions_1.assertSqlSqlToken)(copyQuery);
            return (0, factories_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', (connectionLog, connection, boundConnection) => {
                return boundConnection.copyFromBinary(copyQuery, values, columnTypes);
            }, (newPool) => {
                return newPool.copyFromBinary(copyQuery, values, columnTypes);
            });
        },
        end: async () => {
            const terminateIdleClients = () => {
                const activeConnectionCount = pool.totalCount - pool.idleCount;
                if (activeConnectionCount === 0) {
                    for (const client of pool._clients) {
                        pool._remove(client);
                    }
                }
            };
            pool.slonik.ended = true;
            return new Promise((resolve) => {
                terminateIdleClients();
                pool.on('remove', () => {
                    if (pool.totalCount === 0) {
                        resolve();
                    }
                });
                if (pool.totalCount === 0) {
                    resolve();
                }
            });
        },
        exists: mapConnection('exists'),
        getPoolState: () => {
            return {
                activeConnectionCount: pool.totalCount - pool.idleCount,
                ended: pool.slonik.ended,
                idleConnectionCount: pool.idleCount,
                waitingClientCount: pool.waitingCount,
            };
        },
        many: mapConnection('many'),
        manyFirst: mapConnection('manyFirst'),
        maybeOne: mapConnection('maybeOne'),
        maybeOneFirst: mapConnection('maybeOneFirst'),
        one: mapConnection('one'),
        oneFirst: mapConnection('oneFirst'),
        query: mapConnection('query'),
        stream: (streamQuery, streamHandler, opts) => {
            (0, assertions_1.assertSqlSqlToken)(streamQuery);
            return (0, factories_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_QUERY', (connectionLog, connection, boundConnection) => {
                return boundConnection.stream(streamQuery, streamHandler, opts);
            }, (newPool) => {
                return newPool.stream(streamQuery, streamHandler, opts);
            }, streamQuery);
        },
        transaction: async (transactionHandler) => {
            return (0, factories_1.createConnection)(parentLog, pool, clientConfiguration, 'IMPLICIT_TRANSACTION', (connectionLog, connection) => {
                return (0, connectionMethods_1.transaction)(connectionLog, connection, clientConfiguration, transactionHandler);
            }, (newPool) => {
                return newPool.transaction(transactionHandler);
            });
        },
    };
};
exports.bindPool = bindPool;
//# sourceMappingURL=bindPool.js.map