import { Request } from 'express';
import { UserRole } from 'src/user/entity/user.entity';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
