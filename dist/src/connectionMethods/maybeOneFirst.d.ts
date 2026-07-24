import type { InternalQueryMethodType } from '../types';
/**
 * Makes a query and expects exactly one result.
 * Returns value of the first column.
 *
 * @throws DataIntegrityError If query returns multiple rows.
 */
export declare const maybeOneFirst: InternalQueryMethodType<any>;
