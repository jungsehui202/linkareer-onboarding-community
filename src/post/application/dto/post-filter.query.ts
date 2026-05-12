export interface PostFilterQuery {
  boardId?: number;
  authorId?: number;
  searchKeyword?: string;
  minViewCount?: number;
  minScrapCount?: number;
  skip?: number;
  take?: number;
}
