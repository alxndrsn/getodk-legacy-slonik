"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArraySqlFragment = void 0;
const errors_1 = require("../errors");
const factories_1 = require("../factories");
const tokens_1 = require("../tokens");
const utilities_1 = require("../utilities");
const createArraySqlFragment = (token, greatestParameterPosition) => {
    let placeholderIndex = greatestParameterPosition;
    for (const value of token.values) {
        if (!(0, utilities_1.isPrimitiveValueExpression)(value)) {
            throw new errors_1.InvalidInputError('Invalid array member type. Must be a primitive value expression.');
        }
    }
    const values = [
        token.values,
    ];
    placeholderIndex++;
    let sql = '$' + String(placeholderIndex) + '::';
    if ((0, utilities_1.isSqlToken)(token.memberType) && token.memberType.type === tokens_1.SqlToken) {
        const sqlFragment = (0, factories_1.createSqlTokenSqlFragment)(token.memberType, placeholderIndex);
        placeholderIndex += sqlFragment.values.length;
        // @ts-expect-error (is this right?)
        values.push(...sqlFragment.values);
        sql += sqlFragment.sql;
    }
    else if (typeof token.memberType === 'string') {
        sql += (0, utilities_1.escapeIdentifier)(token.memberType) + '[]';
    }
    else {
        throw new errors_1.InvalidInputError('Unsupported `memberType`. `memberType` must be a string or SqlToken of "SLONIK_TOKEN_SQL" type.');
    }
    return {
        sql,
        // @ts-expect-error
        values,
    };
};
exports.createArraySqlFragment = createArraySqlFragment;
//# sourceMappingURL=createArraySqlFragment.js.map