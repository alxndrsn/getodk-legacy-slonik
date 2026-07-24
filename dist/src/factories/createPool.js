"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = void 0;
const serialize_error_1 = require("serialize-error");
const Logger_1 = require("../Logger");
const bindPool_1 = require("../binders/bindPool");
const utilities_1 = require("../utilities");
const createClientConfiguration_1 = require("./createClientConfiguration");
const createPoolConfiguration_1 = require("./createPoolConfiguration");
/**
 * @param connectionUri PostgreSQL [Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
 */
const createPool = (connectionUri, clientConfigurationInput) => {
    const clientConfiguration = (0, createClientConfiguration_1.createClientConfiguration)(clientConfigurationInput);
    const poolId = (0, utilities_1.createUid)();
    const poolLog = Logger_1.Logger.child({
        poolId,
    });
    const poolConfiguration = (0, createPoolConfiguration_1.createPoolConfiguration)(connectionUri, clientConfiguration);
    let pgNativeBindingsAreAvailable = false;
    try {
        /* eslint-disable @typescript-eslint/no-require-imports, import/no-unassigned-import */
        require('pg-native');
        /* eslint-enable */
        pgNativeBindingsAreAvailable = true;
        poolLog.debug('found pg-native module');
    }
    catch (_a) {
        poolLog.debug('pg-native module is not found');
    }
    let pg;
    let native = false;
    if (clientConfiguration.preferNativeBindings && pgNativeBindingsAreAvailable) {
        poolLog.info('using native libpq bindings');
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        pg = require('pg').native;
        native = true;
    }
    else if (clientConfiguration.preferNativeBindings && !pgNativeBindingsAreAvailable) {
        poolLog.info('using JavaScript bindings; pg-native not found');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        pg = require('pg');
    }
    else {
        poolLog.info('using JavaScript bindings');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        pg = require('pg');
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pool = new pg.Pool(poolConfiguration);
    pool.slonik = {
        ended: false,
        mock: false,
        native,
        poolId,
        typeOverrides: null,
    };
    // istanbul ignore next
    pool.on('error', (error) => {
        if (!error.client.connection.slonik.terminated) {
            poolLog.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'client connection error');
        }
    });
    // istanbul ignore next
    pool.on('connect', (client) => {
        client.connection = client.connection || {};
        client.connection.slonik = {
            connectionId: (0, utilities_1.createUid)(),
            mock: false,
            native,
            terminated: null,
            transactionDepth: null,
        };
        client.on('error', (error) => {
            if (error.message.includes('Connection terminated unexpectedly') || error.message.includes('server closed the connection unexpectedly')) {
                client.connection.slonik.terminated = error;
            }
            poolLog.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'client error');
        });
        client.on('notice', (notice) => {
            poolLog.info({
                notice: {
                    level: notice.name,
                    message: notice.message,
                },
            }, 'notice message');
        });
        poolLog.debug({
            processId: client.processID,
            stats: {
                idleConnectionCount: pool.idleCount,
                totalConnectionCount: pool.totalCount,
                waitingRequestCount: pool.waitingCount,
            },
        }, 'created a new client connection');
    });
    // istanbul ignore next
    pool.on('acquire', (client) => {
        poolLog.debug({
            processId: client.processID,
            stats: {
                idleConnectionCount: pool.idleCount,
                totalConnectionCount: pool.totalCount,
                waitingRequestCount: pool.waitingCount,
            },
        }, 'client is checked out from the pool');
    });
    // istanbul ignore next
    pool.on('remove', (client) => {
        poolLog.debug({
            processId: client.processID,
            stats: {
                idleConnectionCount: pool.idleCount,
                totalConnectionCount: pool.totalCount,
                waitingRequestCount: pool.waitingCount,
            },
        }, 'client connection is closed and removed from the client pool');
    });
    return (0, bindPool_1.bindPool)(poolLog, pool, clientConfiguration);
};
exports.createPool = createPool;
//# sourceMappingURL=createPool.js.map