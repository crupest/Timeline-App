import { Component } from '@angular/core';

export interface User {
  username: string;
  isAdmin: boolean;
}

const mockUsers: User[] = [
  {
    username: "user1",
    isAdmin: true
  },
  {
    username: "useruseruseruser2",
    isAdmin: false
  }
];

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent {
  public users: User[] = mockUsers;
}
