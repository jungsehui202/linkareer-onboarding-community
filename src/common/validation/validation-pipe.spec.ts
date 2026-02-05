import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';

class TestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

describe('ValidationPipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  describe('whitelist property', () => {
    it('should correctly whitelist properties for incoming requests', async () => {
      // Given: DTO에 정의된 속성과 정의되지 않은 속성을 포함한 요청
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        extraField: 'should be removed',
      };

      // When: whitelist만 활성화하고 forbidNonWhitelisted는 비활성화
      const pipeWithWhitelistOnly = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      });

      // Then: DTO에 정의되지 않은 속성은 자동으로 제거됨
      const result = await pipeWithWhitelistOnly.transform(input, {
        type: 'body',
        metatype: TestDto,
      });

      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result).not.toHaveProperty('extraField');
    });

    it('should preserve all whitelisted properties', async () => {
      // Given: DTO에 정의된 모든 속성을 포함한 요청
      const input = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const pipeWithWhitelistOnly = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      });

      // When: 파이프를 통과
      const result = await pipeWithWhitelistOnly.transform(input, {
        type: 'body',
        metatype: TestDto,
      });

      // Then: 모든 속성이 보존됨
      expect(result).toEqual(input);
    });
  });

  describe('forbidNonWhitelisted property', () => {
    it('should forbid non-whitelisted properties and throw an error', async () => {
      // Given: DTO에 정의되지 않은 속성을 포함한 요청
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        invalidField: 'should cause error',
      };

      // When & Then: forbidNonWhitelisted가 true일 때 에러 발생
      await expect(
        validationPipe.transform(input, {
          type: 'body',
          metatype: TestDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error with proper message for non-whitelisted properties', async () => {
      // Given: 여러 개의 정의되지 않은 속성을 포함한 요청
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        extraField1: 'invalid',
        extraField2: 'also invalid',
      };

      // When & Then: 에러 메시지에 속성 정보가 포함됨
      try {
        await validationPipe.transform(input, {
          type: 'body',
          metatype: TestDto,
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        // BadRequestException의 response에 에러 메시지가 포함됨
        expect(response).toBeDefined();
      }
    });

    it('should not throw error when all properties are whitelisted', async () => {
      // Given: DTO에 정의된 속성만 포함한 요청
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // When: 파이프를 통과
      const result = await validationPipe.transform(input, {
        type: 'body',
        metatype: TestDto,
      });

      // Then: 에러 없이 성공
      expect(result).toEqual(input);
    });
  });
});
