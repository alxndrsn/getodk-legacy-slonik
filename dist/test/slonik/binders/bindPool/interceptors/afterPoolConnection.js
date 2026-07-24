"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const sinon_1 = __importDefault(require("sinon"));
const createSqlTag_1 = require("../../../../../src/factories/createSqlTag");
const createPool_1 = require("../../../../helpers/createPool");
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('`afterPoolConnection` is called after `connect`', async (t) => {
    const afterPoolConnection = sinon_1.default.stub();
    const pool = (0, createPool_1.createPool)({
        interceptors: [
            {},
        ],
    });
    await pool.connect(() => {
        return Promise.resolve('foo');
    });
    t.assert(pool.connectSpy.calledBefore(afterPoolConnection));
});
(0, ava_1.default)('`connectionType` is "EXPLICIT" when `connect` is used to create connection', async (t) => {
    const afterPoolConnection = sinon_1.default.stub();
    const pool = (0, createPool_1.createPool)({
        interceptors: [
            {
                afterPoolConnection,
            },
        ],
    });
    await pool.connect(() => {
        return Promise.resolve('foo');
    });
    t.assert(afterPoolConnection.firstCall.args[0].connectionType === 'EXPLICIT');
});
(0, ava_1.default)('`connectionType` is "IMPLICIT_QUERY" when a query method is used to create a connection', async (t) => {
    const afterPoolConnection = sinon_1.default.stub();
    const pool = (0, createPool_1.createPool)({
        interceptors: [
            {
                afterPoolConnection,
            },
        ],
    });
    await pool.query(sql `SELECT 1`);
    t.assert(afterPoolConnection.firstCall.args[0].connectionType === 'IMPLICIT_QUERY');
});
(0, ava_1.default)('`connectionType` is "IMPLICIT_TRANSACTION" when `transaction` is used to create a connection', async (t) => {
    const afterPoolConnection = sinon_1.default.stub();
    const pool = (0, createPool_1.createPool)({
        interceptors: [
            {
                afterPoolConnection,
            },
        ],
    });
    await pool.transaction(() => {
        return Promise.resolve('foo');
    });
    t.assert(afterPoolConnection.firstCall.args[0].connectionType === 'IMPLICIT_TRANSACTION');
});
//# sourceMappingURL=afterPoolConnection.js.map