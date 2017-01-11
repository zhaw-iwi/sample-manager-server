import {Component} from 'angular2/core';
import {RouteParams, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Trigger} from "../../models/trigger";
import {MaterializeDirective} from 'angular2-materialize/dist/index';
import {TriggerService} from '../../services/trigger-service';
import {Trigger} from '../../models/trigger';
import {SharedService} from '../../services/shared-service';
import {Project} from '../../models/project';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {TimeSpanLocal} from '../../models/time-span-local';
import {Timer} from '../../models/timer';
import {LoadingSpinner} from '../common/loading-spinner';

@Component({
  selector: 'trigger-detail',
  templateUrl: 'app/components/trigger-detail/trigger-detail.html',
  styleUrls: ['app/components/trigger-detail/trigger-detail.css'],
  providers: [TriggerService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective, LoadingSpinner],
  pipes: [TranslatePipe]
})

export class TriggerDetail {
  public trigger:Trigger;
  public showLoadingSpinner:boolean = true;
  public newTrigger:Trigger;
  public tempTrigger:any;
  public newValue:string;
  public timeSpan:any;

  private _router:Router;
  private _triggerService:TriggerService;
  private _triggerService:TriggerService;
  private _routeParams:RouteParams;

  constructor(routeParams:RouteParams, triggerService:TriggerService, router:Router, private sharedService:SharedService) {
    this._router = router;
    this._triggerService = triggerService;
    this._routeParams = routeParams;
  }

  ngOnInit() {
    this.showLoadingSpinner = true;
    if (this._routeParams.get('triggerId') === 'neu') {
      let project:Project = new Project();
      project._id = this._routeParams.get('projectId');
      this.tempTrigger = new Trigger(project);
    } else {
      this.refreshTrigger();
    }

  }

  ngOnDestroy() {
    this.sharedService.notify<Trigger>('currentTrigger', null);
    this.sharedService.notify<Project>('currentProject', null);
  }

  private refreshTrigger() {
    this.showLoadingSpinner = true;
    this._triggerService.getTriggerById(this._routeParams.get('triggerId')).subscribe(
      trigger => {
        this.tempTrigger = trigger;
        this.decodeTimeSpan(this.tempTrigger);
      },
      error =>  Materialize.toast(error, 4000),
      () => {
        this.showLoadingSpinner = false;
        this.sharedService.notify<Trigger>('currentTrigger', this.tempTrigger);
        this.sharedService.notify<Project>('currentProject', this.tempTrigger.project);
      }
    );
  }

  private decodeTimeSpan(trigger:Trigger):void {
    this.timeSpan = this._triggerService.decodeTimeSpan(trigger);
  }

  private encodeTimeSpan(trigger:Trigger, timeSpan:TimeSpanLocal):void {
    this._triggerService.encodeTimeSpan(trigger, timeSpan);
  }

  public getIconByType(type):string {
    return this.sharedService.getIconByType(type);
  }


  public addTimer() {
    let timer:Timer = new Timer();
    timer.hour = 10;
    timer.minute = 30;
    this.tempTrigger.timers.push(timer);
  }

  public deleteTimer(timer:Timer) {
    this.tempTrigger.timers.splice(this.tempTrigger.timers.indexOf(timer), 1);
  }

  public getMinutes(minutes:number) {
    if (minutes < 10) {
      return '0' + minutes;
    }
    return minutes;
  }
  
  public saveTrigger(trigger:Trigger) {
    this.encodeTimeSpan(trigger, this.timeSpan);
    this._triggerService.updateTrigger(trigger).subscribe(
      trigger => {
        Materialize.toast('Trigger ' + trigger.alias + ' aktualisiert', 4000);
        this.navigateBack();
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public navigateBack() {
    this._router.navigate(['ProjectDetail', {projectId: this._routeParams.get('projectId')}])
  }

  public repeatEntries = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
  ];

  public timeEntries = [
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
