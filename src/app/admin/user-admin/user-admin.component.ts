import { Component } from '@angular/core';

import { UserInfo } from './entity';
import { UserAdminService } from './user-admin.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent {
  public constructor(private service: UserAdminService) {
    service.getUserList().subscribe(next => {
      this.users = next;
    });
  }

  public users: UserInfo[] | undefined;
}
