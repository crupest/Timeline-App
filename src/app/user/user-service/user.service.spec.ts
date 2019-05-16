import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync } from '@angular/core/testing';

import { Mock } from 'src/app/test/mock';
import { createMockStorage } from 'src/app/test/storage.mock';
import { WINDOW, API_BASE_URL } from '../../inject-tokens';

import {
  kCreateTokenUrl, kVerifyTokenUrl, CreateTokenRequest,
  CreateTokenResponse, VerifyTokenRequest, VerifyTokenResponse, UserInfo
} from './http-entities';
import { UserService, TOKEN_STORAGE_KEY } from './user.service';
import { UserDetails } from '../entities';


describe('UserService', () => {
  const mockApiBaseUrl = 'http://mock/';
  const mockCreateTokenUrl = mockApiBaseUrl + kCreateTokenUrl;
  const mockVerifyTokenUrl = mockApiBaseUrl + kVerifyTokenUrl;

  let mockLocalStorage: Mock<Storage>;

  beforeEach(() => {
    mockLocalStorage = createMockStorage();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: WINDOW, useValue: { localStorage: mockLocalStorage } },
        { provide: API_BASE_URL, useValue: mockApiBaseUrl}
      ]
    });
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  const mockUserInfo: UserInfo = {
    username: 'user',
    isAdmin: true
  };
  const mockToken = 'mock-token';
  const mockUserDetails: UserDetails = {
    username: 'user',
    avatarUrl: mockApiBaseUrl + 'user/user/avatar?token=mock-token',
    isAdmin: true
  }

  describe('verify token', () => {
    const verifyTokenRequestMatcher = (req: HttpRequest<VerifyTokenRequest>): boolean =>
      req.url === mockVerifyTokenUrl && req.body !== null && req.body.token === mockToken;

    function createTest(
      expectUserDetails: UserDetails | null,
      setStorageToken: boolean,
      setHttpController?: (controller: HttpTestingController) => void
    ): () => void {
      return fakeAsync(() => {
        if (setStorageToken) {
          mockLocalStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
        }
        const userService: UserService = TestBed.get(UserService);
        userService.checkSavedLoginState();
        const controller = TestBed.get(HttpTestingController) as HttpTestingController;
        if (setHttpController) {
          setHttpController(controller);
        }
        controller.verify();
        expect(userService.currentUserInfo).toEqual(expectUserDetails);
      });
    }

    it('no login should work well', createTest(null, false));
    it('already login should work well', createTest(mockUserDetails, true,
      controller => controller.expectOne(verifyTokenRequestMatcher).flush(
        <VerifyTokenResponse>{ isValid: true, userInfo: mockUserInfo })));
    it('invalid login should work well', createTest(null, true,
      controller => controller.expectOne(verifyTokenRequestMatcher).flush(<VerifyTokenResponse>{ isValid: false })));
    it('check fail should work well', createTest(null, true,
      controller => controller.expectOne(verifyTokenRequestMatcher).error(
        new ErrorEvent('Network error', { message: 'simulated network error' }))));
  });

  describe('login should work well', () => {
    const mockUserCredentials: CreateTokenRequest = {
      username: 'user',
      password: 'user'
    };

    function createTest(rememberMe: boolean) {
      return () => {
        const service: UserService = TestBed.get(UserService);

        service.login({ ...mockUserCredentials, rememberMe: rememberMe }).subscribe(result => {
          expect(result).toEqual(mockUserDetails);
        });

        const httpController = TestBed.get(HttpTestingController) as HttpTestingController;

        httpController.expectOne((request: HttpRequest<CreateTokenRequest>) =>
          request.url === mockCreateTokenUrl && request.body !== null &&
          request.body.username === mockUserCredentials.username &&
          request.body.password === mockUserCredentials.password).flush(<CreateTokenResponse>{
            success: true,
            token: mockToken,
            userInfo: mockUserInfo
          });

        httpController.verify();

        expect(service.currentUserInfo).toEqual(mockUserDetails);
        expect(mockLocalStorage.getItem(TOKEN_STORAGE_KEY)).toBe(rememberMe ? mockToken : null);
      };
    }

    it('remember me should work well', createTest(true));
    it('not remember me should work well', createTest(false));
  });

  // TODO: test on error situations.
});
