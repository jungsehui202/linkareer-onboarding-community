import { User } from '../../../domain/entities/user.entity';
import { UserView } from '../types/user.type';

export class UserViewMapper {
  static toView(user: User): UserView {
    const view = new UserView();
    view.id = user.id;
    view.email = user.email;
    view.name = user.name;
    view.userRole = user.role;
    view.createdAt = user.createdAt;
    view.updatedAt = user.updatedAt;
    return view;
  }

  static toViewOrNull(user: User | null): UserView | null {
    return user ? UserViewMapper.toView(user) : null;
  }
}
