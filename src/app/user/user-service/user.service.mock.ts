import { UserService } from './user.service';

export function createMockUserService(): jasmine.SpyObj<UserService> {
  return jasmine.createSpyObj('UserService', ['login', 'logout']);
}
