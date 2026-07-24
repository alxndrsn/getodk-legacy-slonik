import type { TypeNameIdentifierType } from '../types';
export declare const encodeTupleList: (tupleList: ReadonlyArray<readonly unknown[]>, columnTypes: readonly TypeNameIdentifierType[]) => Promise<Buffer>;
