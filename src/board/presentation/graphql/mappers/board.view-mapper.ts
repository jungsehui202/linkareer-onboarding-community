import { Board } from '../../../domain/entities/board.entity';
import { BoardView } from '../types/board.type';

export class BoardViewMapper {
  static toView(board: Board): BoardView {
    const view = new BoardView();
    view.id = board.id;
    view.name = board.name;
    view.slug = board.slug;
    view.description = board.description;
    view.parentId = board.parentId;
    view.requiredRole = board.requiredRole;
    view.createdAt = board.createdAt;
    view.updatedAt = board.updatedAt;
    return view;
  }

  static toViewOrNull(board: Board | null): BoardView | null {
    return board ? BoardViewMapper.toView(board) : null;
  }
}
