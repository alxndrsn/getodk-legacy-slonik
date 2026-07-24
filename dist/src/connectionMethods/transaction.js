"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = void 0;
const serialize_error_1 = require("serialize-error");
const binders_1 = require("../binders");
const errors_1 = require("../errors");
const utilities_1 = require("../utilities");
const transaction = async (parentLog, connection, clientConfiguration, handler) => {
    if (connection.connection.slonik.transactionDepth !== null) {
        throw new errors_1.UnexpectedStateError('Cannot use the same connection to start a new transaction before completing the last transaction.');
    }
    connection.connection.slonik.transactionDepth = 0;
    connection.connection.slonik.transactionId = (0, utilities_1.createUid)();
    connection.connection.slonik.transactionQueries = [];
    if (connection.connection.slonik.mock === false) {
        await connection.query('START TRANSACTION');
    }
    const log = parentLog.child({
        transactionId: connection.connection.slonik.transactionId,
    });
    try {
        const result = await handler((0, binders_1.bindTransactionConnection)(log, connection, clientConfiguration, connection.connection.slonik.transactionDepth));
        if (connection.connection.slonik.terminated) {
            throw new errors_1.BackendTerminatedError(connection.connection.slonik.terminated);
        }
        if (connection.connection.slonik.mock === false) {
            await connection.query('COMMIT');
        }
        return result;
    }
    catch (error) {
        if (!connection.connection.slonik.terminated) {
            if (connection.connection.slonik.mock === false) {
                await connection.query('ROLLBACK');
            }
            log.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'rolling back transaction due to an error');
        }
        throw error;
    }
    finally {
        connection.connection.slonik.transactionDepth = null;
        connection.connection.slonik.transactionId = null;
        connection.connection.slonik.transactionQueries = null;
    }
};
exports.transaction = transaction;
//# sourceMappingURL=transaction.js.map