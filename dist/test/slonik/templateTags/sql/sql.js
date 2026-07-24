"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const createSqlTag_1 = require("../../../../src/factories/createSqlTag");
const tokens_1 = require("../../../../src/tokens");
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates an object describing a query', (t) => {
    const query = sql `SELECT 1`;
    t.deepEqual(query, {
        sql: 'SELECT 1',
        type: tokens_1.SqlToken,
        values: [],
    });
});
(0, ava_1.default)('creates an object describing query value bindings', (t) => {
    const query = sql `SELECT ${'foo'}`;
    t.deepEqual(query, {
        sql: 'SELECT $1',
        type: tokens_1.SqlToken,
        values: [
            'foo',
        ],
    });
});
(0, ava_1.default)('creates an object describing query value bindings (multiple)', (t) => {
    const query = sql `SELECT ${'foo'}, ${'bar'}`;
    t.deepEqual(query, {
        sql: 'SELECT $1, $2',
        type: tokens_1.SqlToken,
        values: [
            'foo',
            'bar',
        ],
    });
});
(0, ava_1.default)('nests sql templates', (t) => {
    const query0 = sql `SELECT ${'foo'} FROM bar`;
    const query1 = sql `SELECT ${'baz'} FROM (${query0})`;
    t.deepEqual(query1, {
        sql: 'SELECT $1 FROM (SELECT $2 FROM bar)',
        type: tokens_1.SqlToken,
        values: [
            'baz',
            'foo',
        ],
    });
});
(0, ava_1.default)('does not allow non-sql templates', (t) => {
    const query0 = {
        sql: '); ROLLBACK; DELETE FROM user CASCADE RETURNING 1',
        type: 'SLONIK_TOKEN_SQL',
        values: [],
    };
    const error = t.throws(() => {
        // @ts-expect-error
        sql `SELECT ${'baz'} FROM (${query0})`;
    });
    t.is(error.message, 'Unexpected value expression.');
});
(0, ava_1.default)('throws if bound an undefined value', (t) => {
    const error = t.throws(() => {
        // @ts-expect-error
        sql `SELECT ${undefined}`;
    });
    t.is(error.message, 'SQL tag cannot be bound an undefined value.');
});
(0, ava_1.default)('the sql property is immutable', (t) => {
    const query = sql `SELECT 1`;
    t.throws(() => {
        // @ts-expect-error
        query.sql = 'SELECT 2';
    });
});
//# sourceMappingURL=sql.js.map