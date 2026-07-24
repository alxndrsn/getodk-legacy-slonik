"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const createPool_1 = require("../../helpers/createPool");
(0, ava_1.default)('commits successful transaction', async (t) => {
    const pool = (0, createPool_1.createPool)();
    await pool.transaction(async () => { });
    t.assert(pool.querySpy.getCall(0).args[0] === 'START TRANSACTION');
    t.assert(pool.querySpy.getCall(1).args[0] === 'COMMIT');
});
(0, ava_1.default)('rollbacks unsuccessful transaction', async (t) => {
    const pool = (0, createPool_1.createPool)();
    await t.throwsAsync(pool.transaction(async () => {
        return Promise.reject(new Error('foo'));
    }));
    t.assert(pool.querySpy.getCall(0).args[0] === 'START TRANSACTION');
    t.assert(pool.querySpy.getCall(1).args[0] === 'ROLLBACK');
});
//# sourceMappingURL=transaction.js.map