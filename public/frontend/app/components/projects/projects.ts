import {Component} from 'angular2/core';
import {Http} from 'angular2/http';
import {Router, RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';
import {MaterializeDirective} from 'angular2-materialize';
import {UserService} from "../../services/user-service";
import {User} from "../../models/user";

@Component({
  selector: 'projects',
  templateUrl: 'app/components/projects/projects.html',
  styleUrls: ['app/components/projects/projects.css'],
  providers: [UserService],
  directives: [MaterializeDirective],
  pipes: []
})

export class Projects {

  constructor(router: Router, userService: UserService) {
    $('.parallax').parallax();

    this.user = userService.getUser('dd');
    this.router = router;
  }

  private router:Router;
  public user:User;

  public navigateToProject(id:string) {
    this.router.navigate(['ProjectDetail', { id: id }]);
  }
  public params = [{dismissible: false, complete: function(){$('.lean-overlay').hide();}}];
}
