import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`User ID: ${id} Not Found Exception !`);
  }
}

export class UserEmailNotFoundException extends NotFoundException {
  constructor(email: string) {
    super(`User Email: ${email} Not Found Exception !`);
  }
}

export class UserInvalidPasswordException extends UnauthorizedException {
  constructor() {
    super('Invalid Password Exception !');
  }
}
