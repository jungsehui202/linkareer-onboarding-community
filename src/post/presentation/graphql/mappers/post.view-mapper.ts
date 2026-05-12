import { Post } from '../../../domain/entities/post.entity';
import { PostSearchHit } from '../../../domain/repositories/post.repository';
import { PostView } from '../types/post.type';

export class PostViewMapper {
  static toView(post: Post, rank?: number): PostView {
    const view = new PostView();
    view.id = post.id;
    view.title = post.title;
    view.content = post.content;
    view.viewCount = post.viewCount;
    view.scrapCount = post.scrapCount;
    view.searchCount = post.searchCount;
    view.popularityScore = post.popularityScore;
    view.deletedAt = post.deletedAt;
    view.authorId = post.authorId;
    view.boardId = post.boardId;
    view.createdAt = post.createdAt;
    view.updatedAt = post.updatedAt;
    if (rank !== undefined) view.rank = rank;
    return view;
  }

  static fromSearchHit(hit: PostSearchHit): PostView {
    return PostViewMapper.toView(hit.post, hit.rank);
  }
}
