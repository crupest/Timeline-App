import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';


import { TodoItem } from '../todo-item';
import { TodoService } from '../todo-service/todo.service';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.css', '../todo-list-color-block.css'],
  animations: [
    trigger('leftEnter', [
      transition(':enter', [
        style({
          transform: 'translateX(-100%) translateX(-20px)'
        }),
        animate('400ms ease-out', style({
          transform: 'none'
        }))
      ])
    ]),
    trigger('rightEnter', [
      transition(':enter', [
        style({
          transform: 'translateX(100%) translateX(20px)'
        }),
        animate('400ms ease-out', style({
          transform: 'none'
        }))
      ])
    ])
  ]
})
export class TodoPageComponent implements OnInit {

  public items: TodoItem[] = [];
  public isLoadCompleted = false;

  public constructor(private todoService: TodoService) {
  }

  public ngOnInit(): void {
    this.todoService.getWorkItemList().subscribe({
      next: result => this.items.push(result),
      complete: () => { this.isLoadCompleted = true; }
    });
  }
}
