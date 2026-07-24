"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const serialize_error_1 = require("serialize-error");
const binders_1 = require("../binders");
const errors_1 = require("../errors");
const routines_1 = require("../routines");
const terminatePoolConnection = (pool, connection, error) => {
    if (!connection.connection.slonik.terminated) {
        connection.connection.slonik.terminated = error;
    }
    if (pool.slonik.mock) {
        return;
    }
    pool._remove(connection);
    pool._pulseQueue();
};
// eslint-disable-next-line complexity
const createConnection = async (parentLog, pool, clientConfiguration, connectionType, connectionHandler, poolHandler, query = null) => {
    var _a;
    if (pool.slonik.ended) {
        throw new errors_1.UnexpectedStateError('Connection pool shutdown has been already initiated. Cannot create a new connection.');
    }
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.beforePoolConnection) {
            const maybeNewPool = await interceptor.beforePoolConnection({
                log: parentLog,
                poolId: pool.slonik.poolId,
                query,
            });
            if (maybeNewPool) {
                return poolHandler(maybeNewPool);
            }
        }
    }
    let connection;
    let remainingConnectionRetryLimit = clientConfiguration.connectionRetryLimit;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        remainingConnectionRetryLimit--;
        try {
            connection = await pool.connect();
            break;
        }
        catch (error) {
            parentLog.error({
                error: (0, serialize_error_1.serializeError)(error),
                remainingConnectionRetryLimit,
            }, 'cannot establish connection');
            if (remainingConnectionRetryLimit > 1) {
                parentLog.info('retrying connection');
                continue;
            }
            else {
                throw new errors_1.ConnectionError(error.message);
            }
        }
    }
    if (!connection) {
        throw new errors_1.UnexpectedStateError('Connection handle is not present.');
    }
    if (!pool.slonik.mock) {
        if (!pool.typeOverrides) {
            pool.typeOverrides = (0, routines_1.createTypeOverrides)(connection, clientConfiguration.typeParsers);
        }
        // eslint-disable-next-line id-match
        connection._types = await pool.typeOverrides;
        if (connection.native) {
            // eslint-disable-next-line id-match
            connection.native._types = await pool.typeOverrides;
        }
    }
    const connectionId = connection.connection.slonik.connectionId;
    const connectionLog = parentLog.child({
        connectionId,
    });
    const connectionContext = {
        connectionId,
        connectionType,
        log: connectionLog,
        poolId: pool.slonik.poolId,
    };
    const boundConnection = (0, binders_1.bindPoolConnection)(connectionLog, connection, clientConfiguration);
    try {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.afterPoolConnection) {
                await interceptor.afterPoolConnection(connectionContext, boundConnection);
            }
        }
    }
    catch (error) {
        terminatePoolConnection(pool, connection, error);
        throw error;
    }
    let result;
    try {
        result = await connectionHandler(connectionLog, connection, boundConnection, clientConfiguration);
    }
    catch (error) {
        terminatePoolConnection(pool, connection, error);
        throw error;
    }
    try {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.beforePoolConnectionRelease) {
                await interceptor.beforePoolConnectionRelease(connectionContext, boundConnection);
            }
        }
    }
    catch (error) {
        terminatePoolConnection(pool, connection, error);
        throw error;
    }
    if (pool.slonik.mock === false && pool.slonik.ended === false &&
        ['IMPLICIT_QUERY', 'IMPLICIT_TRANSACTION'].includes(connectionType) &&
        !((_a = connection === null || connection === void 0 ? void 0 : connection.connection) === null || _a === void 0 ? void 0 : _a._usedForStream)) {
        await connection.release();
    }
    else {
        // Do not use `connection.release()` for explicit connections:
        //
        // It is possible that user might mishandle connection release,
        // and same connection is going to end up being used by multiple
        // invocations of `pool.connect`, e.g.
        //
        // ```
        // pool.connect((connection1) => { setTimeout(() => { connection1; }, 1000) });
        // pool.connect((connection2) => { setTimeout(() => { connection2; }, 1000) });
        // ```
        //
        // In the above scenario, connection1 and connection2 are going to be the same connection.
        //
        // `pool._remove(connection)` ensures that we create a new connection for each `pool.connect()`.
        //
        // The downside of this approach is that we cannot leverage idle connection pooling.
        terminatePoolConnection(pool, connection, new errors_1.ConnectionError('Forced connection termination (explicit connection).'));
    }
    return result;
};
exports.createConnection = createConnection;
//# sourceMappingURL=createConnection.js.map