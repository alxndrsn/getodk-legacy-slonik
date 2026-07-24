"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normaliseQueryValues = void 0;
const normaliseQueryValues = (queryValues, native) => {
    if (native && queryValues) {
        const finalValues = [];
        for (const value of queryValues) {
            // Property handle binary/ bytea inserts.
            // @see https://github.com/brianc/node-postgres/issues/980
            // @see https://github.com/brianc/node-pg-native/issues/83
            if (Buffer.isBuffer(value)) {
                finalValues.push('\\x' + value.toString('hex'));
            }
            else {
                finalValues.push(value);
            }
        }
        return finalValues;
    }
    return queryValues;
};
exports.normaliseQueryValues = normaliseQueryValues;
//# sourceMappingURL=normaliseQueryValues.js.map