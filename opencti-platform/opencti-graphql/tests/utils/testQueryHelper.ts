import { expect } from 'vitest';
import { print } from 'graphql/index';
import type { AxiosInstance } from 'axios';
import { createUnauthenticatedClient, executeInternalQuery, queryAsAdmin } from './testQuery';
import { AUTH_REQUIRED, FORBIDDEN_ACCESS } from '../../src/config/errors';
import { downloadFile, streamConverter } from '../../src/database/file-storage';

// Helper for test usage whit expect inside.
// vitest cannot be an import of testQuery, so it must be a separate file.

/**
 * Test utility.
 * Execute the query and verify that there is no error before returning result.
 * @param request
 */
export const queryAsAdminWithSuccess = async (request: { query: any, variables: any }) => {
  const requestResult = await queryAsAdmin({
    query: request.query,
    variables: request.variables,
  });
  expect(requestResult, `Something is wrong with this query: ${request.query}`).toBeDefined();
  expect(requestResult.errors, `This errors should not be there: ${requestResult.errors}`).toBeUndefined();
  return requestResult;
};

/**
 * Execute the query as some User (see testQuery.ts), and verify that access is forbidden.
 * @param client
 * @param request
 */
export const queryAsUserIsExpectedForbidden = async (client: AxiosInstance, request: any) => {
  const queryResult = await executeInternalQuery(client, print(request.query), request.variables);
  expect(queryResult.errors, 'FORBIDDEN_ACCESS is expected.').toBeDefined();
  expect(queryResult.errors?.length, 'FORBIDDEN_ACCESS is expected.').toBe(1);
  expect(queryResult.errors[0].name, 'FORBIDDEN_ACCESS is expected.').toBe(FORBIDDEN_ACCESS);
};

export const queryUnauthenticatedIsExpectedForbidden = async (request: any) => {
  const anonymous = createUnauthenticatedClient();

  const queryResult = await executeInternalQuery(anonymous, print(request.query), request.variables);
  expect(queryResult.errors, 'AUTH_REQUIRED is expected.').toBeDefined();
  expect(queryResult.errors?.length, 'AUTH_REQUIRED is expected.').toBe(1);
  expect(queryResult.errors[0].name, 'AUTH_REQUIRED is expected.').toBe(AUTH_REQUIRED);
};

export const requestFileFromStorageAsAdmin = async (storageId: string) => {
  const stream = await downloadFile(storageId);
  return streamConverter(stream);
};
