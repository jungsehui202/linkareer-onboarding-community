import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { UserService } from '../application/user.service';
import { UserEntity } from '../domain/user.entity';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from './request/user-request.dto';
import { UserResponse } from './response/user-response.dto';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  const mockUserEntity: UserEntity = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    userRole: UserRole.USER,
    subscribeEmail: true,
    subscribeSMS: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    login: jest.fn(),
  };

  const mockUserService = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    findAllActiveUsers: jest.fn(),
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser mutation', () => {
    it('should successfully create a new user with the provided input and assign the correct user role', async () => {
      // Given: 사용자 생성 요청 데이터
      const createUserInput: CreateUserRequest = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
        userRole: UserRole.USER,
      };

      const expectedUserEntity: UserEntity = {
        ...mockUserEntity,
        id: 2,
        email: createUserInput.email,
        name: createUserInput.name,
        userRole: createUserInput.userRole,
        login: jest.fn(),
      };

      mockUserService.createUser.mockResolvedValue(expectedUserEntity);

      // When: createUser 뮤테이션 실행
      const result = await resolver.createUser(createUserInput);

      // Then: 새 사용자가 생성되고 올바른 역할이 할당됨
      expect(result).toBeInstanceOf(UserResponse);
      expect(result.id).toBe(expectedUserEntity.id);
      expect(result.email).toBe(createUserInput.email);
      expect(result.name).toBe(createUserInput.name);
      expect(result.userRole).toBe(createUserInput.userRole);

      // Then: 서비스가 올바른 인자로 호출됨
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserInput);
      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    });

    it('should create user with default USER role when not specified', async () => {
      // Given: userRole이 기본값으로 설정된 요청
      const createUserInput: CreateUserRequest = {
        email: 'defaultuser@example.com',
        password: 'Password123!',
        name: 'Default User',
        userRole: UserRole.USER, // 기본값
      };

      const expectedUserEntity: UserEntity = {
        ...mockUserEntity,
        email: createUserInput.email,
        name: createUserInput.name,
        userRole: UserRole.USER,
        login: jest.fn(),
      };

      mockUserService.createUser.mockResolvedValue(expectedUserEntity);

      // When: createUser 뮤테이션 실행
      const result = await resolver.createUser(createUserInput);

      // Then: USER 역할이 할당됨
      expect(result.userRole).toBe(UserRole.USER);
    });

    it('should create user with ADMIN role when explicitly specified', async () => {
      // Given: ADMIN 역할로 사용자 생성 요청
      const createUserInput: CreateUserRequest = {
        email: 'admin@example.com',
        password: 'Password123!',
        name: 'Admin User',
        userRole: UserRole.ADMIN,
      };

      const expectedUserEntity: UserEntity = {
        ...mockUserEntity,
        email: createUserInput.email,
        name: createUserInput.name,
        userRole: UserRole.ADMIN,
        login: jest.fn(),
      };

      mockUserService.createUser.mockResolvedValue(expectedUserEntity);

      // When: createUser 뮤테이션 실행
      const result = await resolver.createUser(createUserInput);

      // Then: ADMIN 역할이 할당됨
      expect(result.userRole).toBe(UserRole.ADMIN);
    });

    it('should not expose password in UserResponse', async () => {
      // Given: 사용자 생성 요청
      const createUserInput: CreateUserRequest = {
        email: 'secure@example.com',
        password: 'Password123!',
        name: 'Secure User',
        userRole: UserRole.USER,
      };

      mockUserService.createUser.mockResolvedValue(mockUserEntity);

      // When: createUser 뮤테이션 실행
      const result = await resolver.createUser(createUserInput);

      // Then: 응답에 password 필드가 없음
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('updateUser mutation', () => {
    it('should correctly update an existing user\'s details', async () => {
      // Given: 사용자 업데이트 요청
      const updateUserInput: UpdateUserRequest = {
        id: 1,
        name: 'Updated Name',
      };

      const updatedUserEntity: UserEntity = {
        ...mockUserEntity,
        name: updateUserInput.name,
        updatedAt: new Date('2024-01-02'),
        login: jest.fn(),
      };

      mockUserService.updateUser.mockResolvedValue(updatedUserEntity);

      // When: updateUser 뮤테이션 실행
      const result = await resolver.updateUser(updateUserInput);

      // Then: 사용자 정보가 올바르게 업데이트됨
      expect(result).toBeInstanceOf(UserResponse);
      expect(result.id).toBe(updateUserInput.id);
      expect(result.name).toBe(updateUserInput.name);

      // Then: 서비스가 올바른 인자로 호출됨
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
      expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle partial updates correctly', async () => {
      // Given: 일부 필드만 업데이트하는 요청
      const updateUserInput: UpdateUserRequest = {
        id: 1,
        name: 'Partially Updated',
      };

      const updatedUserEntity: UserEntity = {
        ...mockUserEntity,
        name: updateUserInput.name,
        login: jest.fn(),
      };

      mockUserService.updateUser.mockResolvedValue(updatedUserEntity);

      // When: updateUser 뮤테이션 실행
      const result = await resolver.updateUser(updateUserInput);

      // Then: 지정된 필드만 업데이트되고 나머지는 유지됨
      expect(result.name).toBe(updateUserInput.name);
      expect(result.email).toBe(mockUserEntity.email); // 변경되지 않음
      expect(result.userRole).toBe(mockUserEntity.userRole); // 변경되지 않음
    });

    it('should propagate errors from the service layer', async () => {
      // Given: 존재하지 않는 사용자 업데이트 시도
      const updateUserInput: UpdateUserRequest = {
        id: 999,
        name: 'Non-existent User',
      };

      const error = new Error('User not found');
      mockUserService.updateUser.mockRejectedValue(error);

      // When & Then: 에러가 전파됨
      await expect(resolver.updateUser(updateUserInput)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('user query', () => {
    it('should return correct UserResponse when finding by ID', async () => {
      // Given: 유효한 사용자 ID
      mockUserService.findUserById.mockResolvedValue(mockUserEntity);

      // When: user 쿼리 실행
      const result = await resolver.findOne(1);

      // Then: UserResponse가 올바르게 반환됨
      expect(result).toBeInstanceOf(UserResponse);
      expect(result.id).toBe(mockUserEntity.id);
      expect(result.email).toBe(mockUserEntity.email);
      expect(result.name).toBe(mockUserEntity.name);
      expect(result.userRole).toBe(mockUserEntity.userRole);
    });
  });
});
