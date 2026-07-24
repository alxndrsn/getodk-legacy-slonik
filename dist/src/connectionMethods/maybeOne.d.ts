import type { InternalQueryMethodType } from '../types';
/**
 * Makes a query and expects exactly one result.
 *
 * @throws DataIntegrityError If query returns multiple rows.
 */
export declare const maybeOne: InternalQueryMethodType<any>;
