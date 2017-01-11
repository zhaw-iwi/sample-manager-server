import {Component} from 'angular2/core';
import {UserService} from '../../services/user-service';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {User} from "../../models/user";
import {Router} from "angular2/router";
import {MaterializeDirective} from 'angular2-materialize/dist/index';
import {Project} from '../../models/project';
import {ProjectService} from '../../services/project-service';
import {SharedService} from '../../services/shared-service';
import {ActionService} from '../../services/action-service';

@Component({
  selector: 'project-list',
  templateUrl: 'app/components/project-list/project-list.html',
  styleUrls: ['app/components/project-list/project-list.css'],
  providers: [UserService, ProjectService, ActionService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective],
  pipes: []
})

export class ProjectList {
  public user:User;
  public showLoadingSpinner:boolean = true;
  public newProject:Project = new Project();
  public projectToDelete:Project = new Project();
  public params = [{dismissible: false, complete: function(){$('.lean-overlay').hide();}}];
  private errorMessage;


  constructor(private _userService: UserService,
              private _projectService:ProjectService,
              private _router: Router,
              private _sharedService:SharedService,
              private _actionService:ActionService) {

  }

  private refreshUser() {
    this.showLoadingSpinner = true;
    this._userService.authorizeUser().subscribe(
      user => {
        this.user = user;
        this.showLoadingSpinner = false;
      },
      error =>  this.showLoadingSpinner = false
    );
  }

  ngOnInit() {
    this.refreshUser();
  }

  public createProject(project:Project) {
    this._projectService.createProject(project).subscribe(
      project => {
        Materialize.toast('Projekt ' + project.name + ' erstellt', 4000);
        this.newProject = new Project();
        this.refreshUser();
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public deleteProject(project:Project) {
    this._projectService.deleteProject(project._id).subscribe(
      project => {
        Materialize.toast('Projekt ' + project.name + ' gelöscht', 4000);
        this.refreshUser();
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public startProject(project:Project) {
    this._actionService.startProject(project._id).subscribe(
      project => {
        Materialize.toast('Projekt ' + project.name + ' gestartet', 4000);
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public restartProject(project:Project) {
    this._actionService.restartProject(project._id).subscribe(
      project => {
        Materialize.toast('Projekt ' + project.name + ' neu gestartet', 4000);
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public generateNewColor(project:Project) {
    let randomColor = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    project.imageUrl = 'http://dummyimage.com/300x100/' + /*'64B5F6'*/ randomColor + '/000d.png&text=+'

    this._projectService.updateProject(project).subscribe(
      project => {
        Materialize.toast('Projekt ' + project.name + ' neu eingefärbt', 4000);
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public navigateToProject(id:string) {
    this._router.navigate(['ProjectDetail', {projectId: id}]);
  }
}
