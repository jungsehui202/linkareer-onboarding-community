import { InvalidEmailException } from '../exceptions/user.exceptions';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {}

  static of(value: string): Email {
    const trimmed = value?.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      throw new InvalidEmailException(value);
    }
    return new Email(trimmed.toLowerCase());
  }

  equals(other: Email): boolean {
    return other instanceof Email && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
