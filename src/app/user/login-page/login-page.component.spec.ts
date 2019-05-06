import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { createMockUserService } from '../user-service/user.service.mock';
import { createMockRouter } from 'src/app/test-utilities/router.mock';

import { UserService } from '../user-service/user.service';
import { UserInfo } from '../entities';

import { LoginPageComponent } from './login-page.component';

describe('UserLoginComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    mockUserService = createMockUserService();
    mockRouter = createMockRouter();

    // mock property
    (<any>mockUserService).currentUserInfo = null;

    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
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

    mockUserService.login.withArgs(mockValue).and.returnValue(of(<UserInfo>{ username: 'user', roles: ['user'] }));

    component.form.setValue(mockValue);
    component.onLoginButtonClick();

    expect(mockUserService.login).toHaveBeenCalledWith(mockValue);
  });

  it('error message should display', () => {
    const errorMessage = 'custom message';

    fixture.detectChanges();

    const mockValue = {
      username: 'user',
      password: 'user',
      rememberMe: false
    };
    mockUserService.login.withArgs(mockValue).and.returnValue(throwError(new Error(errorMessage)));
    component.form.setValue(mockValue);
    component.onLoginButtonClick();

    fixture.detectChanges();
    expect(component.message).toBe(errorMessage);
    expect((fixture.debugElement.query(By.css('p')).nativeElement as
      HTMLParagraphElement).textContent).toBe(errorMessage);
  });
});
