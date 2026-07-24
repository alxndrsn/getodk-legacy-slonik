"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSqlTag = void 0;
const Logger_1 = require("../Logger");
const errors_1 = require("../errors");
const tokens_1 = require("../tokens");
const utilities_1 = require("../utilities");
const createSqlTokenSqlFragment_1 = require("./createSqlTokenSqlFragment");
const log = Logger_1.Logger.child({
    namespace: 'sql',
});
const sql = (parts, ...values) => {
    let rawSql = '';
    const parameterValues = [];
    let index = 0;
    for (const part of parts) {
        const token = values[index++];
        rawSql += part;
        if (index >= parts.length) {
            continue;
        }
        if (token === undefined) {
            log.debug({
                index,
                values,
            }, 'bound values');
            throw new errors_1.InvalidInputError('SQL tag cannot be bound an undefined value.');
        }
        else if ((0, utilities_1.isPrimitiveValueExpression)(token)) {
            rawSql += '$' + String(parameterValues.length + 1);
            parameterValues.push(token);
        }
        else if ((0, utilities_1.isSqlToken)(token)) {
            const sqlFragment = (0, createSqlTokenSqlFragment_1.createSqlTokenSqlFragment)(token, parameterValues.length);
            rawSql += sqlFragment.sql;
            parameterValues.push(...sqlFragment.values);
        }
        else {
            log.error({
                constructedSql: rawSql,
                index,
                offendingToken: token,
            }, 'unexpected value expression');
            throw new TypeError('Unexpected value expression.');
        }
    }
    const query = {
        sql: rawSql,
        type: tokens_1.SqlToken,
        values: parameterValues,
    };
    Object.defineProperty(query, 'sql', {
        configurable: false,
        enumerable: true,
        writable: false,
    });
    return query;
};
sql.array = (values, memberType) => {
    return {
        memberType,
        type: tokens_1.ArrayToken,
        values,
    };
};
sql.binary = (data) => {
    return {
        data,
        type: tokens_1.BinaryToken,
    };
};
sql.identifier = (names) => {
    return {
        names,
        type: tokens_1.IdentifierToken,
    };
};
sql.json = (value) => {
    return {
        type: tokens_1.JsonToken,
        value,
    };
};
sql.join = (members, glue) => {
    return {
        glue,
        members,
        type: tokens_1.ListToken,
    };
};
sql.unnest = (tuples, columnTypes) => {
    return {
        columnTypes,
        tuples,
        type: tokens_1.UnnestToken,
    };
};
const createSqlTag = () => {
    return sql;
};
exports.createSqlTag = createSqlTag;
//# sourceMappingURL=createSqlTag.js.map