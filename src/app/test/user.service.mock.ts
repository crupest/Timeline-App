import { UserService } from '../user/user-service/user.service';

export function createMockUserService(): jasmine.SpyObj<UserService> {
  return jasmine.createSpyObj('UserService', ['login', 'logout']);
}
