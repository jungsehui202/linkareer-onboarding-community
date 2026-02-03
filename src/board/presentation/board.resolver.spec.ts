import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { BoardService } from '../application/board.service';
import { BoardEntity } from '../domain/board.entity';
import { BoardResolver } from './board.resolver';
import { BoardResponse } from './response/board-response.dto';

describe('BoardResolver', () => {
  let resolver: BoardResolver;
  let boardService: BoardService;

  const mockBoardEntity: BoardEntity = {
    id: 1,
    name: 'Test Board',
    slug: 'test-board',
    description: 'A test board',
    parentId: null,
    requiredRole: UserRole.USER,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockBoardService = {
    findBoardById: jest.fn(),
    findAllByUserRole: jest.fn(),
    findBoardBySlug: jest.fn(),
    findChildBoards: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardResolver,
        {
          provide: BoardService,
          useValue: mockBoardService,
        },
      ],
    }).compile();

    resolver = module.get<BoardResolver>(BoardResolver);
    boardService = module.get<BoardService>(BoardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('board query', () => {
    it('should return the correct BoardResponse when provided a valid ID', async () => {
      // Given: 유효한 ID와 해당 게시판 엔티티
      const boardId = 1;
      mockBoardService.findBoardById.mockResolvedValue(mockBoardEntity);

      // When: board 쿼리 실행
      const result = await resolver.findOne(boardId);

      // Then: BoardResponse 형태로 올바르게 변환되어 반환됨
      expect(result).toBeInstanceOf(BoardResponse);
      expect(result.id).toBe(mockBoardEntity.id);
      expect(result.name).toBe(mockBoardEntity.name);
      expect(result.slug).toBe(mockBoardEntity.slug);
      expect(result.description).toBe(mockBoardEntity.description);
      expect(result.parentId).toBe(mockBoardEntity.parentId);
      expect(result.requiredRole).toBe(mockBoardEntity.requiredRole);
      expect(result.createdAt).toEqual(mockBoardEntity.createdAt);
      expect(result.updatedAt).toEqual(mockBoardEntity.updatedAt);

      // Then: 서비스가 올바른 인자로 호출됨
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockBoardService.findBoardById).toHaveBeenCalledTimes(1);
    });

    it('should handle board with null optional fields correctly', async () => {
      // Given: 선택적 필드가 null인 게시판
      const boardWithNulls: BoardEntity = {
        ...mockBoardEntity,
        description: null,
        parentId: null,
      };
      mockBoardService.findBoardById.mockResolvedValue(boardWithNulls);

      // When: board 쿼리 실행
      const result = await resolver.findOne(1);

      // Then: null 값이 올바르게 처리됨
      expect(result.description).toBeNull();
      expect(result.parentId).toBeNull();
    });

    it('should propagate errors from the service layer', async () => {
      // Given: 서비스에서 에러 발생
      const error = new Error('Board not found');
      mockBoardService.findBoardById.mockRejectedValue(error);

      // When & Then: 에러가 전파됨
      await expect(resolver.findOne(999)).rejects.toThrow('Board not found');
    });
  });

  describe('boards query', () => {
    it('should return correct BoardResponse list filtered by user role', async () => {
      // Given: 여러 게시판과 사용자 역할
      const boards: BoardEntity[] = [
        mockBoardEntity,
        {
          ...mockBoardEntity,
          id: 2,
          name: 'Admin Board',
          slug: 'admin-board',
          requiredRole: UserRole.ADMIN,
        },
      ];
      mockBoardService.findAllByUserRole.mockResolvedValue(boards);

      // When: boards 쿼리 실행
      const result = await resolver.findAll(UserRole.USER);

      // Then: BoardResponse 배열로 변환되어 반환됨
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BoardResponse);
      expect(result[1]).toBeInstanceOf(BoardResponse);
      expect(mockBoardService.findAllByUserRole).toHaveBeenCalledWith(
        UserRole.USER,
      );
    });
  });
});
