import {Component} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Project} from "../../models/project";
import {MaterializeDirective} from 'angular2-materialize/dist/index';
import {CHART_DIRECTIVES} from 'ng2-charts';
import {ProjectService} from '../../services/project-service';
import {Measure} from '../../models/measure';
import {MeasureService} from '../../services/measure-service';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {SharedService} from '../../services/shared-service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MeasureModal} from '../measure-modal/measure-modal';
import {TriggerModal} from '../trigger-modal/trigger-modal';
import {Trigger} from '../../models/trigger';
import {TriggerService} from '../../services/trigger-service';
import {LoadingSpinner} from '../common/loading-spinner';
import {ActionService} from '../../services/action-service';
import {UserModal} from '../user-modal/user-modal';
import {RecordService} from '../../services/record-service';
import {RecordProject} from '../../models/record-project';

@Component({
  selector: 'project-detail',
  templateUrl: 'app/components/project-detail/project-detail.html',
  styleUrls: ['app/components/project-detail/project-detail.css'],
  providers: [ProjectService, MeasureService, TriggerService, ActionService, RecordService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective, MeasureModal, TriggerModal, LoadingSpinner, UserModal],
  pipes: [TranslatePipe]
})

export class ProjectDetail {
  public project:Project;
  public statistics:[RecordProject];
  public showLoadingSpinner:boolean = true;
  public newMeasure:Measure;
  public tempMeasure:Measure;
  public measureToDelete:Measure = new Measure();
  public triggerToDelete:Trigger = new Trigger();
  public newValue:string;
  public params = [{dismissible: false, complete: function(){$('.lean-overlay').hide();}}];

  constructor(private _routeParams:RouteParams,
              private _projectService:ProjectService,
              private _measureService:MeasureService,
              private _triggerService:TriggerService,
              private _router:Router,
              private _sharedService:SharedService,
              private _actionService:ActionService,
              private _recordService:RecordService) {
  }

  ngOnInit() {
    this.refreshProject();
  }

  ngOnDestroy() {
    this._sharedService.notify('currentProject', null)
  }

  public refreshProject() {
    this.showLoadingSpinner = true;
    this._projectService.getProjectById(this._routeParams.get('projectId')).subscribe(
      project => {
        this.project = project;
        this.project.createdDate = new Date(this.project.created);
        this.newMeasure = new Measure(project);
      },
      error =>  Materialize.toast(error, 4000),
      () => {
        this.showLoadingSpinner = false;
        this._sharedService.notify<Project>('currentProject', this.project);
      }
    );

    this._recordService.getRecordsByProject(this._routeParams.get('projectId')).subscribe(
      statistics => {
        this.statistics = statistics;
      },
      error =>  Materialize.toast(error, 4000),
      () => {
        //this.showLoadingSpinner = false;
      }
    );
  }

  public getDate(date:string):Date {
    return new Date(date);
  }

  public getDecodedTimeSpan(trigger){
    return this._triggerService.decodeTimeSpan(trigger);
  }
  public getSelectableValues(measure) {
    return measure.values.split(',');
  }

  public saveData(question) {
    //alert('data saved');
  }

  public getIconByType(type) {
    return this._sharedService.getIconByType(type);
  }

  public getAnswerCount(measure:Measure) {
    let counter:number = 0;

    return counter;
  }

  public addAnswer() {
    this.tempMeasure.values.push(this.newValue);
    this.newValue = '';
  }

  public removeAnswer(value) {
    this.tempMeasure.values.splice(this.tempMeasure.values.indexOf(value), 1);
  }

  public saveMeasure(measure:Measure) {
    if (measure._id) {
      this._measureService.updateMeasure(measure).subscribe(
        measure => {
          Materialize.toast('Messung aktualisiert', 4000);
          this.refreshProject();
        },
        error =>  Materialize.toast(error, 4000)
      );
    } else {
      this._measureService.createMeasure(measure).subscribe(
        measure => {
          Materialize.toast('Messung erstellt', 4000);
          this.refreshProject();
        },
        error =>  Materialize.toast(error, 4000)
      );
    }
  }

  public getTriggerById(id:string):Trigger {
    let triggers:[Trigger] = require('lodash').filter(this.project.triggers, function(trigger) {
      return trigger._id === id;
    });

    if (!triggers || triggers.length === 0) {
      return {};
    }

    return triggers[0];
  }

  public getMeasureValues(values:[string]):string {
    let resultString:string = '';
    for (let i = 0; i < values.length; i++) {
      resultString += values[i];
      if ((i + 1) < values.length) {
        resultString += ' - ';
      }
    }
    return resultString;
  }

  public triggerManual(measureId:string):void {
    this._actionService.triggerManual(measureId).subscribe(
      measure => {
        Materialize.toast('Messung ' + measure.alias + ' ausgelöst', 4000);
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public deleteMeasure(measure:Measure) {
    this._measureService.deleteMeasure(measure._id).subscribe(
      measure => {
        Materialize.toast('Messung ' + measure.alias + ' gelöscht', 4000);
        this.refreshProject();
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public deleteTrigger(trigger:Trigger) {
    this._triggerService.deleteTrigger(trigger._id).subscribe(
      measure => {
        Materialize.toast('Trigger ' + trigger.alias + ' gelöscht', 4000);
        this.refreshProject();
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public navigateToMeasure(id:string) {
    this._router.navigate(['MeasureDetail', {projectId: this._routeParams.get('projectId'), measureId: id}]);
  }

  public navigateToTrigger(id:string) {
    this._router.navigate(['TriggerDetail', {projectId: this._routeParams.get('projectId'), triggerId: id}]);
  }

  public navigateBack() {
    this._router.navigate(['ProjectList'])
  }


  private collectSelectedUsers():string[] {
    let users:string[] = [];
    for (let i = 0; i < this.project.users.length; i++) {
      if (this.project.users[i].checked)
      users.push(this.project.users[i]._id);
    }
    return users;
  }

  public repeatEntries:[number] = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ];

  public timeEntries:[string] = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00'
  ]

}
