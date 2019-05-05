import { Component, Input } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable, from } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TodoItem } from '../todo-item';
import { TodoPageComponent } from './todo-page.component';
import { TodoService } from '../todo-service/todo.service';

function asyncArray<T>(data: T[]): Observable<T> {
  return from(data).pipe(delay(0));
}

@Component({
  selector: 'app-todo-item',
  template: ''
})
export class TodoItemStubComponent {
  @Input() item!: TodoItem;
}

describe('TodoListPageComponent', () => {
  let component: TodoPageComponent;
  let fixture: ComponentFixture<TodoPageComponent>;

  const mockTodoItems: TodoItem[] = [
    {
      number: 0,
      title: 'Test title 1',
      isClosed: true,
      detailUrl: 'test_url1'
    },
    {
      number: 1,
      title: 'Test title 2',
      isClosed: false,
      detailUrl: 'test_url2'
    }
  ];

  beforeEach(async(() => {
    const mockTodoService: jasmine.SpyObj<TodoService> = jasmine.createSpyObj('TodoService', ['getWorkItemList']);

    mockTodoService.getWorkItemList.and.returnValue(asyncArray(mockTodoItems));

    TestBed.configureTestingModule({
      declarations: [TodoPageComponent, TodoItemStubComponent],
      imports: [NoopAnimationsModule],
      providers: [{ provide: TodoService, useValue: mockTodoService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show progress bar during loading', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#loadingIndicator'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#pageBody'))).toBeFalsy();
  });

  it('should hide progress bar after loading', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#loadingIndicator'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('#pageBody'))).toBeTruthy();
  }));
});
