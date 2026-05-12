export class HashedPassword {
  private constructor(public readonly value: string) {}

  static fromHash(hash: string): HashedPassword {
    if (!hash || hash.length === 0) {
      throw new Error('HashedPassword cannot be empty');
    }
    return new HashedPassword(hash);
  }

  toString(): string {
    return this.value;
  }
}
