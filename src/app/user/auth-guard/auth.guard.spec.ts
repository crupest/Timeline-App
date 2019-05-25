import { Observable, of } from 'rxjs';

import { AuthGuard, AuthStrategy } from './auth.guard';
import { UserDetails } from '../entities';
import { UserService } from '../user-service/user.service';

describe('AuthGuard', () => {
  class TestAuthGuard extends AuthGuard {
    public constructor(userService: any, strategy: AuthStrategy) {
      super(userService as UserService);
      this.authStrategy = strategy;
    }

    public readonly authStrategy: AuthStrategy;
  }

  const mockUser = <UserDetails>{
    username: 'haha',
    avatarUrl: '',
    isAdmin: false
  };

  const mockAdmin = <UserDetails>{
    username: 'haha',
    avatarUrl: '',
    isAdmin: true
  };

  interface ActivateResultMap {
    nologin: boolean;
    loginAsUser: boolean;
    loginAsAdmin: boolean;
  }

  function createTest(authStrategy: AuthStrategy, result: ActivateResultMap): () => void {
    return () => {
      const mockUserService: any = {};
      const guard = new TestAuthGuard(mockUserService, authStrategy);

      function testWith(userDetails: UserDetails | null, r: boolean): void {
        mockUserService.user$ = of(userDetails);
        const rawResult = guard.canActivate(<any>null, <any>null);
        if (typeof rawResult === 'boolean') {
          expect(rawResult).toBe(r);
        } else if (rawResult instanceof Observable) {
          rawResult.subscribe(next => expect(next).toBe(r));
        } else {
          throw new Error('Unsupported return type.');
        }
      }

      testWith(null, result.nologin);
      testWith(mockUser, result.loginAsUser);
      testWith(mockAdmin, result.loginAsAdmin);
    };
  }

  it('all should work', createTest('all', { nologin: true, loginAsUser: true, loginAsAdmin: true }));
  it('nologin should work', createTest('nologin', { nologin: true, loginAsUser: false, loginAsAdmin: false }));
  it('user should work', createTest('user', { nologin: false, loginAsUser: true, loginAsAdmin: true }));
  it('admin should work', createTest('admin', { nologin: false, loginAsUser: false, loginAsAdmin: true }));

  it('auth failed callback should be called', () => {
    const mockUserService: any = { user$: of(null) };
    const guard = new TestAuthGuard(mockUserService, 'user');
    const onAuthFialedSpy = spyOn(guard, 'onAuthFailed');
    (<Observable<boolean>>guard.canActivate(<any>null, <any>null)).subscribe();
    expect(onAuthFialedSpy).toHaveBeenCalled();
  });
});
