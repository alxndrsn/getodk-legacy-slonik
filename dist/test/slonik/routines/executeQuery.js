"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importStar(require("ava"));
const roarr_1 = __importDefault(require("roarr"));
const errors_1 = require("../../../src/errors");
const executeQuery_1 = require("../../../src/routines/executeQuery");
const createClientConfiguration_1 = require("../../helpers/createClientConfiguration");
const test = ava_1.default;
const beforeEach = ava_1.beforeEach;
const createConnectionStub = () => {
    return {
        connection: {
            slonik: {
                terminated: null,
            },
        },
    };
};
beforeEach((t) => {
    t.context.logger = roarr_1.default;
    t.context.connection = createConnectionStub();
    t.context.executionRoutine = () => { };
});
test('throws a descriptive error if query is empty', async (t) => {
    const error = await t.throwsAsync(() => {
        return (0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, (0, createClientConfiguration_1.createClientConfiguration)(), '', [], 'foo', t.context.executionRoutine);
    });
    t.assert(error instanceof errors_1.InvalidInputError);
    t.assert(error.message === 'Unexpected SQL input. Query cannot be empty.');
});
test('throws a descriptive error if the entire query is a value binding', async (t) => {
    const error = await t.throwsAsync(() => {
        return (0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, (0, createClientConfiguration_1.createClientConfiguration)(), '$1', [], 'foo', t.context.executionRoutine);
    });
    t.assert(error instanceof errors_1.InvalidInputError);
    t.assert(error.message === 'Unexpected SQL input. Query cannot be empty. Found only value binding.');
});
//# sourceMappingURL=executeQuery.js.map