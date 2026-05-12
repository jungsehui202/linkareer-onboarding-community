export interface UpdatePostCommand {
  id: number;
  actorId: number;
  isActorAdmin: boolean;
  title?: string;
  content?: string;
  boardId?: number;
}
