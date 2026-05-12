export class BoardDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class BoardNotFoundException extends BoardDomainException {
  constructor(identifier: number | string) {
    if (typeof identifier === 'number') {
      super(`Board with ID ${identifier} not found`);
    } else {
      super(`Board with slug '${identifier}' not found`);
    }
  }
}
