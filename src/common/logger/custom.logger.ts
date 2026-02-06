import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  debug(message: string, context?: string) {
    if (
      process.env.NODE_ENV === 'local' ||
      process.env.NODE_ENV === 'development'
    ) {
      super.debug(message, context);
    }
  }

  log(message: string, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.log(message, context);
    }
  }
}
