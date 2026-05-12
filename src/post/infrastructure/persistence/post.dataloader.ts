import DataLoader from 'dataloader';
import { PostRepository } from '../../domain/repositories/post.repository';

export function createPostCountByBoardLoader(
  postRepository: PostRepository,
): DataLoader<number, number> {
  return new DataLoader<number, number>(
    async (boardIds: readonly number[]) => {
      const counts = await postRepository.countByBoardIds([...boardIds]);
      return boardIds.map((id) => counts.get(id) ?? 0);
    },
    { cache: true },
  );
}
