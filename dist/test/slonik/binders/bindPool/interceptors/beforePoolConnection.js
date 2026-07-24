"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const sinon_1 = __importDefault(require("sinon"));
const createPool_1 = require("../../../../helpers/createPool");
(0, ava_1.default)('`beforePoolConnection` is called before `connect`', async (t) => {
    const beforePoolConnection = sinon_1.default.stub();
    const pool = (0, createPool_1.createPool)({
        interceptors: [
            {
                beforePoolConnection,
            },
        ],
    });
    await pool.connect(() => {
        return Promise.resolve('foo');
    });
    t.assert(beforePoolConnection.calledBefore(pool.connectSpy));
});
//# sourceMappingURL=beforePoolConnection.js.map