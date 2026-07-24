"use strict";
/**
 * Functions in this file are never actually run - they are purely
 * a type-level tests to ensure the typings don't regress.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMethods = exports.queryMethod = void 0;
const expect_type_1 = require("expect-type");
const src_1 = require("../src");
const queryMethod = async () => {
    const client = (0, src_1.createPool)('');
    const query = await client.query((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(query).toMatchTypeOf();
};
exports.queryMethod = queryMethod;
const queryMethods = async () => {
    const client = (0, src_1.createPool)('');
    // any
    const any = await client.any((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(any).toEqualTypeOf();
    const anyTyped = await client.any((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(anyTyped).toEqualTypeOf();
    const anyTypedQuery = await client.any((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(anyTypedQuery).toEqualTypeOf();
    // anyFirst
    const anyFirst = await client.anyFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(anyFirst).toEqualTypeOf();
    const anyFirstTyped = await client.anyFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(anyFirstTyped).toEqualTypeOf();
    const anyFirstTypedQuery = await client.anyFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(anyFirstTypedQuery).toEqualTypeOf();
    // many
    const many = await client.many((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(many).toEqualTypeOf();
    const manyTyped = await client.many((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(manyTyped).toEqualTypeOf();
    const manyTypedQuery = await client.many((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(manyTypedQuery).toEqualTypeOf();
    // manyFirst
    const manyFirst = await client.manyFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(manyFirst).toEqualTypeOf();
    const manyFirstTyped = await client.manyFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(manyFirstTyped).toEqualTypeOf();
    const manyFirstTypedQuery = await client.manyFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(manyFirstTypedQuery).toEqualTypeOf();
    // maybeOne
    const maybeOne = await client.maybeOne((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(maybeOne).toEqualTypeOf();
    const maybeOneTyped = await client.maybeOne((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneTyped).toEqualTypeOf();
    const maybeOneTypedQuery = await client.maybeOne((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneTypedQuery).toEqualTypeOf();
    // maybeOneFirst
    const maybeOneFirst = await client.maybeOneFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneFirst).toEqualTypeOf();
    const maybeOneFirstTyped = await client.maybeOneFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneFirstTyped).toEqualTypeOf();
    const maybeOneFirstTypedQuery = await client.maybeOneFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneFirstTypedQuery).toEqualTypeOf();
    // one
    const one = await client.one((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(one).toEqualTypeOf();
    const oneTyped = await client.one((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(oneTyped).toEqualTypeOf();
    const oneTypedQuery = await client.one((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(oneTypedQuery).toEqualTypeOf();
    // oneFirst
    const oneFirst = await client.oneFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(oneFirst).toEqualTypeOf();
    const oneFirstTyped = await client.oneFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(oneFirstTyped).toEqualTypeOf();
    const oneFirstTypedQuery = await client.oneFirst((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(oneFirstTypedQuery).toEqualTypeOf();
    // query
    const query = await client.query((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(query).toMatchTypeOf();
    const queryTyped = await client.query((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(queryTyped).toMatchTypeOf();
    const queryTypedQuery = await client.query((0, src_1.sql) ``);
    (0, expect_type_1.expectTypeOf)(queryTypedQuery).toMatchTypeOf();
};
exports.queryMethods = queryMethods;
//# sourceMappingURL=types.js.map