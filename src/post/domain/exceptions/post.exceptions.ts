export class PostDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class PostNotFoundException extends PostDomainException {
  constructor(id: number) {
    super(`Post with ID ${id} not found`);
  }
}

export class PostPermissionException extends PostDomainException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidSearchKeywordException extends PostDomainException {
  constructor(message: string) {
    super(message);
  }
}
