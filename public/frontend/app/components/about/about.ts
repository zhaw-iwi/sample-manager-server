import {Component} from 'angular2/core';
import {Http} from 'angular2/http';
import {MaterializeDirective} from 'angular2-materialize';
import {UserService} from "../../services/user-service";
import {User} from "../../models/user";

@Component({
  selector: 'about',
  templateUrl: 'app/components/about/about.html',
  styleUrls: ['app/components/about/about.css'],
  providers: [UserService],
  directives: [MaterializeDirective],
  pipes: []
})

export class About {

  constructor(http: Http, userService: UserService) {
    $('.parallax').parallax();

    let user:User = userService.getUser('dd');
  }
  public params = [{dismissible: false, complete: function(){$('.lean-overlay').hide();}}];
}
