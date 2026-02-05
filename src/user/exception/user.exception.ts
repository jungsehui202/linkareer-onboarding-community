import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: number | string) {
    const message =
      typeof identifier === 'number'
        ? `User with ID ${identifier} not found`
        : `User with email ${identifier} not found`;
    super(message);
  }
}

export class UserInvalidPasswordException extends UnauthorizedException {
  constructor() {
    super('Invalid Password Exception !');
  }
}
