import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PartialObserver } from 'rxjs';

import { Mock } from 'src/app/test/mock';
import { createMockStorage } from 'src/app/test/storage.mock';

import { WINDOW, API_BASE_URL } from '../../inject-tokens';

import { UserDetails } from '../entities';
import {
  kCreateTokenUrl, kVerifyTokenUrl, CreateTokenRequest,
  CreateTokenResponse, VerifyTokenRequest, VerifyTokenResponse, UserInfo
} from './http-entities';
import { AlreadyLoginError, BadCredentialsError, NoLoginError } from './errors';

import { UserService, TOKEN_STORAGE_KEY } from './user.service';


describe('UserService', () => {
  const _mockData = {
    apiBaseUrl: 'http://mock/',
    token: 'mocktoken',
    username: 'user',
    password: 'password',
    isAdmin: true,
  };

  const mocks = {
    apiBaseUrl: _mockData.apiBaseUrl,
    createTokenUrl: _mockData.apiBaseUrl + kCreateTokenUrl,
    verifyTokenUrl: _mockData.apiBaseUrl + kVerifyTokenUrl,
    token: _mockData.token,
    userInfo: <UserInfo>{
      username: _mockData.username,
      isAdmin: _mockData.isAdmin
    },
    userDetails: <UserDetails>{
      username: _mockData.username,
      avatarUrl: `${_mockData.apiBaseUrl}user/${_mockData.username}/avatar?token=${_mockData.token}`,
      isAdmin: _mockData.isAdmin
    },
    createTokenRequest: <CreateTokenRequest>{
      username: _mockData.username,
      password: _mockData.password
    }
  };

  const createTokenRequestMatcher = (req: HttpRequest<CreateTokenRequest>): boolean =>
    req.url === mocks.createTokenUrl && req.body !== null &&
    req.body.username === mocks.createTokenRequest.username &&
    req.body.password === mocks.createTokenRequest.password;
  const verifyTokenRequestMatcher = (req: HttpRequest<VerifyTokenRequest>): boolean =>
    req.url === mocks.verifyTokenUrl && req.body !== null && req.body.token === mocks.token;

  let mockLocalStorage: Mock<Storage>;

  beforeEach(() => {
    mockLocalStorage = createMockStorage();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: WINDOW, useValue: { localStorage: mockLocalStorage } },
        { provide: API_BASE_URL, useValue: mocks.apiBaseUrl }
      ]
    });
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  describe('checkSavedLoginState should work', () => {
    function createTest(
      expectUserDetails: boolean,
      setStorageToken: boolean,
      setupHttpController?: (controller: HttpTestingController) => void
    ): () => void {
      return () => {
        if (setStorageToken) {
          mockLocalStorage.setItem(TOKEN_STORAGE_KEY, mocks.token);
        }
        const userService: UserService = TestBed.get(UserService);
        userService.checkSavedLoginState();
        const controller = TestBed.get(HttpTestingController) as HttpTestingController;
        if (setupHttpController) {
          setupHttpController(controller);
        }
        controller.verify();
        expect(userService.currentUser).toEqual(expectUserDetails ? mocks.userDetails : null);
      };
    }

    it('no login should work well', createTest(false, false));
    it('already login should work well', createTest(true, true,
      controller => controller.expectOne(verifyTokenRequestMatcher).flush(
        <VerifyTokenResponse>{ isValid: true, userInfo: mocks.userInfo })));
    it('invalid login should work well', createTest(false, true,
      controller => controller.expectOne(verifyTokenRequestMatcher).flush(
        <VerifyTokenResponse>{ isValid: false })));
    it('check fail should work well', createTest(false, true,
      controller => controller.expectOne(verifyTokenRequestMatcher).error(
        new ErrorEvent('Network error', { message: 'simulated network error' }))));
  });

  describe('login should work', () => {
    describe('basic function should work', () => {
      let userService: UserService;

      function createTest(
        setupHttpController: (controller: HttpTestingController) => void,
        observer: PartialObserver<UserDetails>
      ): () => void {
        return () => {
          userService = TestBed.get(UserService);
          userService.login({ ...mocks.createTokenRequest, rememberMe: false }).subscribe(observer);
          const controller = TestBed.get(HttpTestingController) as HttpTestingController;
          setupHttpController(controller);
          controller.verify();
        };
      }

      it('success should work', createTest(
        controller => controller.expectOne(createTokenRequestMatcher).flush(
          <CreateTokenResponse>{
            success: true,
            token: mocks.token,
            userInfo: mocks.userInfo
          }
        ), {
          next: userDetails => {
            expect(userDetails).toEqual(mocks.userDetails);
            expect(userService.currentUser).toEqual(mocks.userDetails);
          }
        }
      ));

      it('bad credentials should work', createTest(
        controller => controller.expectOne(createTokenRequestMatcher).flush(
          <CreateTokenResponse>{
            success: false
          }
        ), {
          error: error => {
            expect(error instanceof BadCredentialsError).toBeTruthy();
            expect(userService.currentUser).toBeUndefined();
          }
        }
      ));

      it('bad network should work', createTest(
        controller => controller.expectOne(createTokenRequestMatcher).error(
          new ErrorEvent('Network error', { message: 'simulated network error' })),
        {
          error: error => {
            expect(error instanceof HttpErrorResponse).toBeTruthy();
            expect(userService.currentUser).toBeUndefined();
          }
        }
      ));

      it('already login should throw', () => {
        userService = TestBed.get(UserService);
        userService.login({ ...mocks.createTokenRequest, rememberMe: false }).subscribe();
        const controller = TestBed.get(HttpTestingController) as HttpTestingController;
        controller.expectOne(createTokenRequestMatcher).flush(<CreateTokenResponse>{
          success: true,
          token: mocks.token,
          userInfo: mocks.userInfo
        });
        controller.verify();
        expect(() =>
          userService.login({ ...mocks.createTokenRequest, rememberMe: false }).subscribe()
        ).toThrowError(AlreadyLoginError);
      });
    });

    describe('remember me should work', () => {
      function createTest(rememberMe: boolean): () => void {
        return () => {
          const service: UserService = TestBed.get(UserService);
          service.login({ ...mocks.createTokenRequest, rememberMe: rememberMe }).subscribe();

          const httpController = TestBed.get(HttpTestingController) as HttpTestingController;
          httpController.expectOne(createTokenRequestMatcher).flush(<CreateTokenResponse>{
            success: true,
            token: mocks.token,
            userInfo: mocks.userInfo
          });
          httpController.verify();

          expect(service.currentUser).toEqual(mocks.userDetails);
          expect(mockLocalStorage.getItem(TOKEN_STORAGE_KEY)).toBe(rememberMe ? mocks.token : null);
        };
      }

      it('remember me should work well', createTest(true));
      it('not remember me should work well', createTest(false));
    });
  });

  function login(userService: UserService, rememberMe: boolean = false): void {
    userService.login({ ...mocks.createTokenRequest, rememberMe: rememberMe }).subscribe();
    const controller = TestBed.get(HttpTestingController) as HttpTestingController;
    controller.expectOne(createTokenRequestMatcher).flush(
      <CreateTokenResponse>{
        success: true,
        token: mocks.token,
        userInfo: mocks.userInfo
      });
    expect(userService.currentUser).toEqual(mocks.userDetails);
    if (rememberMe) {
      expect(mockLocalStorage.getItem(TOKEN_STORAGE_KEY)).toBe(mocks.token);
    }
  }

  describe('logout should work', () => {
    it('basic function should work', () => {
      const service: UserService = TestBed.get(UserService);
      login(service, true);
      service.logout();
      expect(service.currentUser).toBeNull();
      expect(mockLocalStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      login(service, false);
      service.logout();
      expect(service.currentUser).toBeNull();
    });

    it('no login should throw', () => {
      const service: UserService = TestBed.get(UserService);
      expect(function () { service.logout(); }).toThrowError(NoLoginError);
    });
  });

  describe('generate avatar url should work', () => {
    it('basic function should work', () => {
      const service: UserService = TestBed.get(UserService);
      login(service);
      const aUsername = 'hahaha';
      expect(service.generateAvartarUrl(aUsername)).toBe(
        `${mocks.apiBaseUrl}user/${aUsername}/avatar?token=${mocks.token}`);
    });

    it('no login should throw', () => {
      const service: UserService = TestBed.get(UserService);
      expect(function () { service.generateAvartarUrl('hahaha'); }).toThrowError(NoLoginError);
    });
  });

  describe('get user details should work', () => {
    let controller: HttpTestingController;
    let service: UserService;

    const aUsername = 'hahaha';
    const url = `${mocks.apiBaseUrl}user/${aUsername}?token=${mocks.token}`;

    beforeEach(() => {
      controller = TestBed.get(HttpTestingController);
      service = TestBed.get(UserService);
    });

    it('get should work', () => {
      login(service);
      const aUserInfo = <UserInfo>{
        username: aUsername,
        isAdmin: true
      };
      const aUserDetails = <UserDetails>{
        ...aUserInfo,
        avatarUrl: `${mocks.apiBaseUrl}user/${aUsername}/avatar?token=${mocks.token}`
      };
      service.getUserDetails(aUsername).subscribe(result => {
        expect(result).toEqual(aUserDetails);
      });
      controller.expectOne(url).flush(aUserInfo);
      controller.verify();
    });

    it('not exist should work', () => {
      login(service);
      service.getUserDetails(aUsername).subscribe(result => {
        expect(result).toBeNull();
      });
      controller.expectOne(url).error(new ErrorEvent('404 error'), {
        status: 404
      });
      controller.verify();
    });

    it('no login should throw', () => {
      expect(function () { service.getUserDetails(aUsername); }).toThrowError(NoLoginError);
    });
  });
});
