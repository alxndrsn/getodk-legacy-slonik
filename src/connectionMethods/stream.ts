import type {
  Readable,
} from 'stream';
import through from 'through2';
import QueryStream from 'pg-query-stream';
import {
  UnexpectedStateError,
} from '../errors';
import {
  executeQuery,
} from '../routines';
import type {
  InterceptorType,
  InternalStreamFunctionType,
} from '../types';

export const stream: InternalStreamFunctionType = async (connectionLogger, connection, clientConfiguration, rawSql, values, streamHandler, opts) => {
  return executeQuery(
    connectionLogger,
    connection,
    clientConfiguration,
    rawSql,
    values,
    undefined,
    (finalConnection, finalSql, finalValues, executionContext, actualQuery) => {
      if (connection.connection.slonik.native) {
        throw new UnexpectedStateError('Result cursors do not work with the native driver. Use JavaScript driver.');
      }

      const query = new QueryStream(finalSql, finalValues as any[], opts as any);
      const isArrayMode = opts?.rowMode === 'array';

      const queryStream: Readable = finalConnection.query(query);

      let fields:any;
      if(!isArrayMode) finalConnection.connection.once('rowDescription', (rowDescription:any) => {
        fields = rowDescription.fields.map((f:any) => ({
          name: f.name,
          dataTypeId: f.dataTypeID,
        }));
      });

      const rowTransformers: Array<NonNullable<InterceptorType['transformRow']>> = [];

      for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.transformRow) {
          rowTransformers.push(interceptor.transformRow);
        }
      }

      return new Promise((resolve, reject) => {
        queryStream.on('error', (error: Error) => {
          reject(error);
        });

        const transformedStream = queryStream.pipe(through.obj(function (row: any, enc: any, callback: any) {
          if(isArrayMode) {
            this.push(row);
          } else {
            let finalRow = row;

            if (rowTransformers.length) {
              for (const rowTransformer of rowTransformers) {
                finalRow = rowTransformer(executionContext, actualQuery, finalRow, fields);
              }
            }

            // eslint-disable-next-line fp/no-this
            this.push({
              fields,
              row: finalRow,
            });
          }
          callback();
        }));

        transformedStream.on('end', () => {
          // @ts-expect-error
          resolve({});
        });

        // Invoked if stream is destroyed using transformedStream.destroy().
        transformedStream.on('close', () => {
          if (!queryStream.destroyed) {
            queryStream.destroy();
          }

          // @ts-expect-error
          resolve({});
        });

        transformedStream.on('error', (error: Error) => {
          queryStream.destroy(error);
        });

        transformedStream.once('readable', () => {
          streamHandler(transformedStream);
        });
      });
    },
  );
};
