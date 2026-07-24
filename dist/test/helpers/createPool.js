"use strict";
/* eslint-disable fp/no-events */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = void 0;
const events_1 = __importDefault(require("events"));
const sinon_1 = __importDefault(require("sinon"));
const bindPool_1 = require("../../src/binders/bindPool");
const Logger_1 = require("./Logger");
const defaultConfiguration = {
    interceptors: [],
    typeParsers: [],
};
const createPool = (clientConfiguration = defaultConfiguration) => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const eventEmitter = new events_1.default();
    const connection = {
        connection: {
            slonik: {
                connectionId: '1',
                mock: false,
                poolId: '1',
                transactionDepth: null,
            },
        },
        emit: eventEmitter.emit.bind(eventEmitter),
        end: () => { },
        off: eventEmitter.off.bind(eventEmitter),
        on: eventEmitter.on.bind(eventEmitter),
        query: () => {
            return {};
        },
        release: () => { },
    };
    const internalPool = {
        _pulseQueue: () => { },
        _remove: () => { },
        connect: () => {
            return connection;
        },
        slonik: {
            ended: false,
            mock: false,
            poolId: '1',
        },
    };
    const connectSpy = sinon_1.default.spy(internalPool, 'connect');
    const endSpy = sinon_1.default.spy(connection, 'end');
    const querySpy = sinon_1.default.stub(connection, 'query').returns({});
    const releaseSpy = sinon_1.default.spy(connection, 'release');
    const removeSpy = sinon_1.default.spy(internalPool, '_remove');
    const pool = (0, bindPool_1.bindPool)(Logger_1.Logger, internalPool, 
    // @ts-expect-error
    {
        interceptors: [],
        typeParsers: [],
        ...clientConfiguration,
    });
    return {
        ...pool,
        connection,
        connectSpy,
        endSpy,
        querySpy,
        releaseSpy,
        removeSpy,
    };
};
exports.createPool = createPool;
//# sourceMappingURL=createPool.js.map