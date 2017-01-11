import {Component} from 'angular2/core';
import {Measure} from "../../models/measure";
import {MaterializeDirective} from 'angular2-materialize/dist/index';
import {MeasureService} from '../../services/measure-service';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {SharedService} from '../../services/shared-service';
import {Input} from 'angular2/core';
import {Project} from '../../models/project';

import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

@Component({
  selector: 'measure-modal',
  templateUrl: 'app/components/measure-modal/measure-modal.html',
  styleUrls: ['app/components/measure-modal/measure-modal.css'],
  providers: [MeasureService],
  directives: [MaterializeDirective],
  pipes: [TranslatePipe]
})

export class MeasureModal {
  @Input('smProject') project: Project;
  @Output('smChanged') changed = new EventEmitter();

  public showLoadingSpinner:boolean = true;
  public tempMeasure:any;
  public parentMeasure:any;
  public parentMeasureValues:[string] =  [];
  public parentMeasureId:string;
  public newValue:string;

  public modalStep:number = 1;

  private _measureService:MeasureService;

  constructor(measureService:MeasureService, private _sharedService:SharedService) {
    this._measureService = measureService;
  }

  public selectType(type:string){
    this.tempMeasure.type = type;
    if (type === 'rating') {
      this.tempMeasure.values = [1,2,3,4,5,6,7,8,9,10];
    } else if (type === 'frequency') {
      this.tempMeasure.values = [0,1,2,3,4,5,6,7,8,9,10];
    } else if (type === 'yes_no') {
      this.tempMeasure.values = ['Ja', 'Nein'];
    }
    this.modalStep = 2;
  }

  public initMeasure() {
    this.tempMeasure = new Measure(this.project);
    this.modalStep = 1;
  }
  public getIconByType(type:string):string {
    return this._sharedService.getIconByType(type);
  }

  public addAnswer() {
    this.tempMeasure.values.push(this.newValue);
    this.newValue = '';
  }

  public removeAnswer(value) {
    this.tempMeasure.values.splice(this.tempMeasure.values.indexOf(value), 1);
  }

  public step(value:number) {
    if (value === 1 && this.modalStep === 2 &&
      (this.tempMeasure.type === 'location' ||
        this.tempMeasure.type === 'volume')) {
      this.modalStep = 5;
    } else if ( value === -1 && this.modalStep === 5 &&
      (this.tempMeasure.type === 'location' ||
      this.tempMeasure.type === 'volume')) {
      this.modalStep = 2;
    } else if ( value === 1 && this.modalStep === 3 && this.tempMeasure.type === 'open') {
      this.modalStep = 5;
    } else if ( value === -1 && this.modalStep === 5 && this.tempMeasure.type === 'open') {
      this.modalStep = 3;
    } else {
      this.modalStep += value;
    }
  }

  public cancel():void {
    this.initMeasure();
    $('#createMeasure').closeModal();
  }

  public setParentMeasure(measure:Measure):void {
    this.parentMeasure = measure;
  }

  public onChange(value) {
    this.tempMeasure.parentValues = [];
    //this.parentMeasure.values = [];

    this.parentMeasure = require('lodash').findWhere(this.project.measures, {_id: value});

    this.tempMeasure.parent = this.parentMeasure;

    $('select').material_select();
  }

  public saveMeasure(measure:Measure) {

      this._measureService.createMeasure(measure).subscribe(
        measure => {
          Materialize.toast('Messung erstellt', 4000);
          $('#createMeasure').closeModal();
          this.changed.emit('event');
          this.initMeasure();
        },
        error =>  Materialize.toast(error, 4000)
      );

  }

  public measureTypes:[string] = [
    'select_one',
    'select_many',
    //'likert_scale',
    //'visual_analog_scale',
    //'yes_no',
    'frequency',
    'rating',
    'open',
    //'volume',
    //'location'
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
