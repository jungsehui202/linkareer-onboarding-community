import { GraphQLError } from 'graphql';

/**
 * GraphQL 표준 에러 코드
 *
 * HTTP Status Code와 매핑:
 * - NOT_FOUND: 404
 * - UNAUTHORIZED: 401
 * - FORBIDDEN: 403
 * - BAD_REQUEST: 400
 * - CONFLICT: 409
 * - INTERNAL_SERVER_ERROR: 500
 */
export enum GqlErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

/**
 * GraphQL Error 생성 함수
 *
 * @param code - 에러 코드 (GqlErrorCode Enum)
 * @param message - 에러 메시지
 * @param additionalExtensions - 추가 메타데이터 (선택)
 *
 * @example
 * throw createGqlError(GqlErrorCode.NOT_FOUND, 'User not found', { userId: 123 });
 */
export function createGqlError(
  code: GqlErrorCode,
  message: string,
  additionalExtensions?: Record<string, any>,
): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code,
      timestamp: new Date().toISOString(),
      ...additionalExtensions,
    },
  });
}

/**
 * GraphQL Error 편의 함수 모음
 *
 * 자주 사용하는 에러 타입에 대한 shortcut 제공
 *
 * @example
 * throw GqlError.notFound('User not found');
 * throw GqlError.conflict('Email already exists', { email: 'user@example.com' });
 */
export const GqlError = {
  notFound: (message: string, meta?: Record<string, any>) =>
    createGqlError(GqlErrorCode.NOT_FOUND, message, meta),

  unauthorized: (message: string, meta?: Record<string, any>) =>
    createGqlError(GqlErrorCode.UNAUTHORIZED, message, meta),

  forbidden: (message: string, meta?: Record<string, any>) =>
    createGqlError(GqlErrorCode.FORBIDDEN, message, meta),

  badRequest: (message: string, meta?: Record<string, any>) =>
    createGqlError(GqlErrorCode.BAD_REQUEST, message, meta),

  conflict: (message: string, meta?: Record<string, any>) =>
    createGqlError(GqlErrorCode.CONFLICT, message, meta),

  internal: (message: string, meta?: Record<string, any>) =>
    createGqlError(GqlErrorCode.INTERNAL_SERVER_ERROR, message, meta),
};
