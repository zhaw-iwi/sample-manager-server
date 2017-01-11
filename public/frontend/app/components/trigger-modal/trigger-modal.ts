import {Component} from 'angular2/core';
import {Trigger} from "../../models/trigger";
import {MaterializeDirective} from 'angular2-materialize/dist/index';
import {TriggerService} from '../../services/trigger-service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {SharedService} from '../../services/shared-service';
import {Input} from 'angular2/core';
import {Project} from '../../models/project';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {TimeSpan} from '../../models/time-span';
import {TimeSpanLocal} from '../../models/time-span-local';
import {Timer} from '../../models/timer';

@Component({
  selector: 'trigger-modal',
  templateUrl: 'app/components/trigger-modal/trigger-modal.html',
  styleUrls: ['app/components/trigger-modal/trigger-modal.css'],
  providers: [TriggerService],
  directives: [MaterializeDirective],
  pipes: [TranslatePipe]
})

export class TriggerModal {
  @Input('smProject') project:Project;
  @Output('smChanged') changed = new EventEmitter();

  public timeSpan:TimeSpanLocal = new TimeSpanLocal();
  public showLoadingSpinner:boolean = true;
  public tempTrigger:any;
  public newValue:string;

  public modalStep:number = 1;

  private _triggerService:TriggerService;

  constructor(triggerService:TriggerService, private _sharedService:SharedService) {
    this._triggerService = triggerService;
  }

  public selectType(type:string) {
    this.tempTrigger.type = type;
    this.modalStep = 2;
  }

  public initTrigger() {
    this.tempTrigger = new Trigger(this.project);
    this.modalStep = 1;
  }

  public getIconByType(type:string):string {
    return this._sharedService.getIconByType(type);
  }

  public addAnswer() {
    this.tempTrigger.values.push(this.newValue);
    this.newValue = '';
  }

  public removeAnswer(value) {
    this.tempTrigger.values.splice(this.tempTrigger.values.indexOf(value), 1);
  }
/*
  public removeTimeSpan(timeSpan:TimeSpanLocal):void {
    this.timeSpan.splice(this.timeSpan.indexOf(timeSpan), 1);
  }

  public addTimeSpan():void {
    this.timeSpan.push(new TimeSpanLocal());
  }
*/
  public step(value:number) {
    if (value === 1 && this.modalStep === 2 &&
      (this.tempTrigger.type === 'location' ||
      this.tempTrigger.type === 'volume')) {
      this.modalStep = 5;
    } else if ( value === -1 && this.modalStep === 5 &&
      (this.tempTrigger.type === 'location' ||
      this.tempTrigger.type === 'volume')) {
      this.modalStep = 2;
    } else {
      this.modalStep += value;
    }
  }

  public cancel() {
    this.initTrigger();
    $('#createTrigger').closeModal();
  }

  private encodeTimeSpan(trigger:Trigger):void {
    this._triggerService.encodeTimeSpan(trigger, this.timeSpan);
  }

  public saveTrigger(trigger:Trigger) {
    this.encodeTimeSpan(trigger);
    this._triggerService.createTrigger(trigger).subscribe(
      trigger => {
        Materialize.toast('Trigger ' + trigger.alias + '  erstellt', 4000);
        $('#createTrigger').closeModal();
        this.changed.emit('event');
        this.initTrigger();
      },
      error =>  Materialize.toast(error, 4000)
    );
  }

  public getMinutes(minutes:number) {
    if (minutes < 10) {
      return '0' + minutes;
    }
    return minutes;
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

  public triggerTypes:[string] = [
    'random',
    'timer'
    //'place',
    //'social',
    //'health',
    //'external'

  ];

  public triggerSpecialTypes:[string] = [
    'and',
    'or'
  ];

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

