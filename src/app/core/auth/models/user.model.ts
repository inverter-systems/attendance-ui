import { Role } from './role.model';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
