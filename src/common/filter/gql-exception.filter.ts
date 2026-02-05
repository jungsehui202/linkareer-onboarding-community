import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { GqlErrorCode, createGqlError } from '../exception/gql-error.helper';

@Catch()
export class GlobalGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    // 이미 GraphQLError면 그대로 반환
    if (exception instanceof GraphQLError) {
      return exception;
    }

    // NestJS HttpException 변환
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      const codeMap: Record<number, GqlErrorCode> = {
        400: GqlErrorCode.BAD_REQUEST,
        401: GqlErrorCode.UNAUTHORIZED,
        403: GqlErrorCode.FORBIDDEN,
        404: GqlErrorCode.NOT_FOUND,
        409: GqlErrorCode.CONFLICT,
      };

      const code = codeMap[status] || GqlErrorCode.INTERNAL_SERVER_ERROR;
      return createGqlError(code, message);
    }

    // 알 수 없는 에러
    console.error('Unhandled exception: ', exception);
    return createGqlError(
      GqlErrorCode.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred',
    );
  }
}
