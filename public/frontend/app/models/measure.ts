import {Project} from './project';
import {Trigger} from "./trigger";
import {Record} from './record';

export class Measure {
  public _id:string;
  public alias:string;
  public type:string;
  public text:string;
  public values:string[]; // maybe extend the model here
  public records:Record[];
  public project:Project;
  public parent:Measure;
  public parentValues:string[];
  public trigger:Trigger;


  constructor(project:Project) {
    this.type = 'Ja / Nein   ';
    this.values = [];
    this.records = [];
    this.parentValues = [];
    this.project = project;
  }
}
