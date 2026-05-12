export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UserNotFoundException extends DomainException {
  constructor(identifier: number | string) {
    const subject =
      typeof identifier === 'number'
        ? `ID ${identifier}`
        : `email ${identifier}`;
    super(`User with ${subject} not found`);
  }
}

export class DuplicateUserEmailException extends DomainException {
  constructor(email: string) {
    super(`User email already exists: ${email}`);
  }
}

export class InvalidEmailException extends DomainException {
  constructor(value: string) {
    super(`Invalid email format: ${value}`);
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid email or password');
  }
}

export class UserAlreadyDeletedException extends DomainException {
  constructor(id: number) {
    super(`User ${id} is already deleted`);
  }
}
