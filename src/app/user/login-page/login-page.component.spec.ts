import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { LoginPageComponent } from './login-page.component';

import { createMockUserService } from 'src/app/test/user.service.mock';
import { createMockRouter } from 'src/app/test/router.mock';

import { UserDetails } from '../entities';
import { UserService } from '../user-service/user.service';
import { BadCredentialsError } from '../user-service/errors';

import { MockActivatedRoute } from 'src/app/test/activated-route.mock';

describe('UserLoginComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async(() => {
    mockUserService = createMockUserService();
    mockRouter = createMockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      imports: [ReactiveFormsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('reactive form should work well', () => {
    fixture.detectChanges();

    const usernameInput = fixture.debugElement.query(By.css('input[type=text]')).nativeElement as HTMLInputElement;
    const passwordInput = fixture.debugElement.query(By.css('input[type=password]')).nativeElement as HTMLInputElement;
    const rememberMeCheckbox = fixture.debugElement.query(By.css('input[type=checkbox]')).nativeElement as HTMLInputElement;

    usernameInput.value = 'user';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'user';
    passwordInput.dispatchEvent(new Event('input'));
    rememberMeCheckbox.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();

    expect(component.form.value).toEqual({
      username: 'user',
      password: 'user',
      rememberMe: true
    });
  });

  it('login should work well', () => {
    fixture.detectChanges();

    const mockValue = {
      username: 'user',
      password: 'user',
      rememberMe: true
    };

    mockUserService.login.withArgs(mockValue).and.returnValue(of(<UserDetails>{
      username: 'user', avatarUrl: '', isAdmin: false
    }));

    component.form.setValue(mockValue);
    component.onLoginButtonClick();

    expect(mockUserService.login).toHaveBeenCalledWith(mockValue);
  });

  describe('error message should display', () => {
    function createTest(error: any, test: () => void) {
      return () => {
        fixture.detectChanges();
        const mockValue = {
          username: 'user',
          password: 'user',
          rememberMe: false
        };
        mockUserService.login.withArgs(mockValue).and.returnValue(throwError(error));
        component.form.setValue(mockValue);
        component.onLoginButtonClick();

        fixture.detectChanges();
        test();
      };
    }

    it('unknown should work', createTest(new Error(), () => {
      expect(component.error).toBe('unknown');
      expect(fixture.debugElement.query(By.css('p#unknownError'))).toBeTruthy();
    }));

    it('bad credential should work', createTest(new BadCredentialsError(), () => {
      expect(component.error).toBe('badcredentials');
      expect(fixture.debugElement.query(By.css('p#badcredentialsError'))).toBeTruthy();
    }));
  });

  it('Redirect should work', () => {
    const mockRedirectUrl = 'hahaha';
    mockActivatedRoute.pushSnapshotWithData({
      mockQueryParamMap: {
        'from': mockRedirectUrl
      }
    });

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('p.redirect-message'))).toBeTruthy();

    const mockValue = {
      username: 'user',
      password: 'user',
      rememberMe: false
    };
    mockUserService.login.withArgs(mockValue).and.returnValue(of(<any>null));
    component.form.setValue(mockValue);
    component.onLoginButtonClick();
    fixture.detectChanges();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(mockRedirectUrl);
  });

  it('login button should be disabled when waiting', fakeAsync(() => {
    fixture.detectChanges();

    const mockValue = {
      username: 'user',
      password: 'user',
      rememberMe: true
    };

    mockUserService.login.withArgs(mockValue).and.returnValue(of(<any>null).pipe(delay(200), switchMap(_ => throwError(new Error()))));

    component.form.setValue(mockValue);
    component.onLoginButtonClick();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

    tick(100);
    fixture.detectChanges();
    expect(component.logining).toBe(true);
    expect(button.disabled).toBe(true);

    tick(100);
    fixture.detectChanges();
    expect(component.logining).toBe(false);
    expect(button.disabled).toBe(false);
  }));
});
