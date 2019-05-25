import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { UserPageComponent } from './user-page.component';
import { UserService } from '../user-service/user.service';

import { MockActivatedRoute } from 'src/app/test/activated-route.mock';
import { By } from '@angular/platform-browser';
import { UserDetails } from '../entities';
import { of } from 'rxjs';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  let mockUserService: jasmine.SpyObj<UserService>;
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUserDetails1: UserDetails = {
    username: 'mock1',
    isAdmin: true,
    avatarUrl: 'http://aurlthatnotexist/url1'
  };

  const mockUserDetails2: UserDetails = {
    username: 'mock2',
    isAdmin: false,
    avatarUrl: 'http://aurlthatnotexist/url2'
  };

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj<UserService>('UserService', ['logout', 'getUserDetails']);
    // do not move next line into specs or you will meet an extremely strange bug.
    (<any>mockUserService).currentUser = mockUserDetails1;
    mockActivatedRoute = new MockActivatedRoute();
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loading should show', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#loadIndicator'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#notExistMessage'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('#userContainer'))).toBeFalsy();
  });

  it('user not exist should work', () => {
    const aUsername = 'notexist';
    mockUserService.getUserDetails.withArgs(aUsername).and.returnValue(of(null));
    mockActivatedRoute.pushSnapshotWithData({
      mockParamMap: {
        username: aUsername
      }
    });
    fixture.detectChanges();

    expect(mockUserService.getUserDetails).toHaveBeenCalledWith(aUsername);
    expect(fixture.debugElement.query(By.css('#loadIndicator'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('#notExistMessage'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#userContainer'))).toBeFalsy();
  });

  describe('user info part should work', () => {

    function testInfoPart(userDetails: UserDetails): void {
      expect(fixture.debugElement.query(By.css('#userContainer'))).toBeTruthy();
      expect((fixture.debugElement.query(By.css('img.avatar')).nativeElement as HTMLImageElement)
        .src).toBe(userDetails.avatarUrl);
      expect((fixture.debugElement.query(By.css('span.username')).nativeElement as HTMLSpanElement)
        .textContent).toBe(userDetails.username);
      if (userDetails.isAdmin) {
        expect(fixture.debugElement.query(By.css('span.role-admin'))).toBeTruthy();
      } else {
        expect(fixture.debugElement.query(By.css('span.role-user'))).toBeTruthy();
      }
    }

    it('self and admin role and logout should work', () => {
      mockActivatedRoute.pushSnapshotWithData({
        mockParamMap: {
          username: mockUserDetails1.username
        }
      });
      fixture.detectChanges();

      expect(mockUserService.getUserDetails).not.toHaveBeenCalled();
      testInfoPart(mockUserDetails1);
      const logoutButtonDebug = fixture.debugElement.query(By.css('button.logout-button'));
      expect(logoutButtonDebug).toBeTruthy();
      (logoutButtonDebug.nativeElement as HTMLButtonElement).dispatchEvent(new MouseEvent('click'));
      expect(mockUserService.logout).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('other and user role should work', () => {
      mockUserService.getUserDetails.withArgs(mockUserDetails2.username)
        .and.returnValue(of(mockUserDetails2));
      mockActivatedRoute.pushSnapshotWithData({
        mockParamMap: {
          username: mockUserDetails2.username
        }
      });
      fixture.detectChanges();

      expect(mockUserService.getUserDetails).toHaveBeenCalledWith(mockUserDetails2.username);
      testInfoPart(mockUserDetails2);
      expect(fixture.debugElement.query(By.css('button.logout-button'))).toBeFalsy();
    });
  });
});
