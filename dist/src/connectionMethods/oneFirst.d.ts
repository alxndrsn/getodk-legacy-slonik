import type { InternalQueryMethodType } from '../types';
/**
 * Makes a query and expects exactly one result.
 * Returns value of the first column.
 *
 * @throws NotFoundError If query returns no rows.
 * @throws DataIntegrityError If query returns multiple rows.
 */
export declare const oneFirst: InternalQueryMethodType<any>;
