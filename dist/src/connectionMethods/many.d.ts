import type { InternalQueryMethodType } from '../types';
/**
 * Makes a query and expects at least 1 result.
 *
 * @throws NotFoundError If query returns no rows.
 */
export declare const many: InternalQueryMethodType<any>;
