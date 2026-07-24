"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedTransaction = void 0;
const serialize_error_1 = require("serialize-error");
const binders_1 = require("../binders");
const utilities_1 = require("../utilities");
const nestedTransaction = async (parentLog, connection, clientConfiguration, handler, transactionDepth) => {
    const newTransactionDepth = transactionDepth + 1;
    if (connection.connection.slonik.mock === false) {
        await connection.query('SAVEPOINT slonik_savepoint_' + String(newTransactionDepth));
    }
    const log = parentLog.child({
        transactionId: (0, utilities_1.createUid)(),
    });
    try {
        connection.connection.slonik.transactionDepth = newTransactionDepth;
        const result = await handler((0, binders_1.bindTransactionConnection)(log, connection, clientConfiguration, newTransactionDepth));
        return result;
    }
    catch (error) {
        if (connection.connection.slonik.mock === false) {
            await connection.query('ROLLBACK TO SAVEPOINT slonik_savepoint_' + String(newTransactionDepth));
        }
        log.error({
            error: (0, serialize_error_1.serializeError)(error),
        }, 'rolling back transaction due to an error');
        throw error;
    }
    finally {
        connection.connection.slonik.transactionDepth = newTransactionDepth - 1;
    }
};
exports.nestedTransaction = nestedTransaction;
//# sourceMappingURL=nestedTransaction.js.map