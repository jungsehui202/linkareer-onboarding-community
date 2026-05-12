import { PostPermissionException } from '../exceptions/post.exceptions';

export interface PostSnapshot {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  scrapCount: number;
  searchCount: number;
  popularityScore: number;
  authorId: number | null;
  boardId: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostParams {
  title: string;
  content: string;
  authorId: number;
  boardId: number;
}

export interface UpdatePostParams {
  title?: string;
  content?: string;
  boardId?: number;
}

const VIEW_POPULARITY_WEIGHT = 5;
const SCRAP_POPULARITY_WEIGHT = 50;

export class Post {
  private constructor(
    public readonly id: number,
    private _title: string,
    private _content: string,
    private _viewCount: number,
    private _scrapCount: number,
    private _searchCount: number,
    private _popularityScore: number,
    private _authorId: number | null,
    private _boardId: number,
    private _deletedAt: Date | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(params: CreatePostParams): Post {
    const now = new Date();
    return new Post(
      0,
      params.title,
      params.content,
      0,
      0,
      0,
      0,
      params.authorId,
      params.boardId,
      null,
      now,
      now,
    );
  }

  static rehydrate(snapshot: PostSnapshot): Post {
    return new Post(
      snapshot.id,
      snapshot.title,
      snapshot.content,
      snapshot.viewCount,
      snapshot.scrapCount,
      snapshot.searchCount,
      snapshot.popularityScore,
      snapshot.authorId,
      snapshot.boardId,
      snapshot.deletedAt,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get viewCount(): number {
    return this._viewCount;
  }

  get scrapCount(): number {
    return this._scrapCount;
  }

  get searchCount(): number {
    return this._searchCount;
  }

  get popularityScore(): number {
    return this._popularityScore;
  }

  get authorId(): number | null {
    return this._authorId;
  }

  get boardId(): number {
    return this._boardId;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  update(params: UpdatePostParams): void {
    if (params.title !== undefined) this._title = params.title;
    if (params.content !== undefined) this._content = params.content;
    if (params.boardId !== undefined) this._boardId = params.boardId;
    this._updatedAt = new Date();
  }

  incrementView(): void {
    this._viewCount += 1;
    this._popularityScore += VIEW_POPULARITY_WEIGHT;
    this._updatedAt = new Date();
  }

  incrementScrap(): void {
    this._scrapCount += 1;
    this._popularityScore += SCRAP_POPULARITY_WEIGHT;
    this._updatedAt = new Date();
  }

  decrementScrap(): void {
    this._scrapCount = Math.max(0, this._scrapCount - 1);
    this._popularityScore = Math.max(
      0,
      this._popularityScore - SCRAP_POPULARITY_WEIGHT,
    );
    this._updatedAt = new Date();
  }

  incrementSearchCount(): void {
    this._searchCount += 1;
  }

  softDelete(now: Date = new Date()): void {
    this._deletedAt = now;
    this._updatedAt = now;
  }

  assertCanBeModifiedBy(userId: number, isAdmin: boolean = false): void {
    if (isAdmin) return;
    if (this._authorId !== userId) {
      throw new PostPermissionException(
        '본인이 작성한 게시글만 수정/삭제할 수 있습니다.',
      );
    }
  }

  toSnapshot(): PostSnapshot {
    return {
      id: this.id,
      title: this._title,
      content: this._content,
      viewCount: this._viewCount,
      scrapCount: this._scrapCount,
      searchCount: this._searchCount,
      popularityScore: this._popularityScore,
      authorId: this._authorId,
      boardId: this._boardId,
      deletedAt: this._deletedAt,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
