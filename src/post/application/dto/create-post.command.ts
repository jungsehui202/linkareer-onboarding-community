export interface CreatePostCommand {
  title: string;
  content: string;
  boardId: number;
  authorId: number;
}
