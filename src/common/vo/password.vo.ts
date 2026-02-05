import * as crypto from 'crypto';

// Password Value Object
// 비밀번호 해싱 및 검증
export class Password {
  private static readonly ALGORITHM = 'sha256';

  private constructor(private readonly hashedPassword: string) {}

  // 평문 비밀번호를 해싱하여 Password 객체 생성
  static fromPlainText(plainPassword: string): Password {
    const hashed = this.hash(plainPassword);
    return new Password(hashed);
  }

  // 이미 해싱된 비밀번호로 Password 객체 생성
  static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  // 평문 비밀번호와 비교
  match(plainPassword: string): boolean {
    return this.hashedPassword === Password.hash(plainPassword);
  }

  // 해싱된 비밀번호 반환 (DB 저장용)
  getValue(): string {
    return this.hashedPassword;
  }

  // SHA-256 해싱
  private static hash(password: string): string {
    return crypto.createHash(this.ALGORITHM).update(password).digest('hex');
  }
}
