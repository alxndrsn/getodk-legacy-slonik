import EventEmitter from 'events';
import sinon from 'sinon';
import type { ClientConfigurationInputType } from '../../src/types';
export declare const createPool: (clientConfiguration?: ClientConfigurationInputType) => {
    connection: {
        connection: {
            slonik: {
                connectionId: string;
                mock: boolean;
                poolId: string;
                transactionDepth: null;
            };
        };
        emit: <E extends string | symbol>(eventName: string | symbol, ...args: any[]) => boolean;
        end: () => void;
        off: <E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter<any>;
        on: <E extends string | symbol>(eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter<any>;
        query: () => {};
        release: () => void;
    };
    connectSpy: sinon.SinonSpy<any[], any>;
    endSpy: sinon.SinonSpy<any[], any>;
    querySpy: sinon.SinonStub<any[], any>;
    releaseSpy: sinon.SinonSpy<any[], any>;
    removeSpy: sinon.SinonSpy<any[], any>;
    any: import("../../src/types").QueryAnyFunctionType;
    anyFirst: import("../../src/types").QueryAnyFirstFunctionType;
    exists: import("../../src/types").QueryExistsFunctionType;
    many: import("../../src/types").QueryManyFunctionType;
    manyFirst: import("../../src/types").QueryManyFirstFunctionType;
    maybeOne: import("../../src/types").QueryMaybeOneFunctionType;
    maybeOneFirst: import("../../src/types").QueryMaybeOneFirstFunctionType;
    one: import("../../src/types").QueryOneFunctionType;
    oneFirst: import("../../src/types").QueryOneFirstFunctionType;
    query: import("../../src/types").QueryFunctionType;
    connect: <T>(connectionRoutine: import("../../src/types").ConnectionRoutineType<T>) => Promise<T>;
    copyFromBinary: import("../../src/types").QueryCopyFromBinaryFunctionType;
    end: () => Promise<void>;
    getPoolState: () => import("../../src/types").PoolStateType;
    stream: import("../../src/types").StreamFunctionType;
    transaction: <T>(handler: import("../../src/types").TransactionFunctionType<T>) => Promise<T>;
    configuration: import("../../src/types").ClientConfigurationType;
};
