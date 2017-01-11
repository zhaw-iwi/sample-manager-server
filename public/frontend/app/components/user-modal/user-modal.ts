import {Component} from 'angular2/core';
import {User} from "../../models/user";
import {MaterializeDirective} from 'angular2-materialize/dist/index';
import {UserService} from '../../services/user-service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {SharedService} from '../../services/shared-service';
import {Project} from '../../models/project';

import {Input} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

@Component({
  selector: 'user-modal',
  templateUrl: 'app/components/user-modal/user-modal.html',
  styleUrls: ['app/components/user-modal/user-modal.css'],
  providers: [UserService],
  directives: [MaterializeDirective],
  pipes: [TranslatePipe]
})

export class UserModal {
  @Input('smProject') project: Project;
  @Output('smChanged') changed = new EventEmitter();

  public showLoadingSpinner:boolean = true;
  public userEmails:string;

  constructor(private _userService:UserService,
              private _sharedService:SharedService) {
  }

  public initUser() {
    this.userEmails = '';
  }

  public createUsers() {
    let users:User[] = [];
    let emails:string[] = this.userEmails.split(';');
    if (emails.length > 0) {
      for (let i = 0; i < emails.length; i++) {
        let user:User = new User();
        user.email = emails[i];
        user.projects = [this.project._id];
        users.push(user);
      }
      this._userService.createUsersForProject(users).subscribe(
        users => {
          Materialize.toast(users.length + ' User erstellt', 4000);
          $('#createUser').closeModal();
          this.changed.emit('event');
          this.initUser();
        },
        error =>  Materialize.toast(error, 4000)
      );
    }

  }
}
