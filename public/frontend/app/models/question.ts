import {Project} from './project';
import {Answer} from './answer';
import {Rule} from "./rule";

export class Question {
  private _id:string;
  private _type:string;
  private _text:string;
  private _answerValues:string[]; // maybe extend the model here
  private _answers:Answer[];
  private _project:Project;
  private _rules:Rule[];

  constructor(id:string, type:string, text:string, answerValues:string[], answers:Answer[], project:Project, rules:Rule[]) {
    this._id = id;
    this._type = type;
    this._text = text;
    this._answerValues = answerValues;
    this._answers = answers;
    this._project = project;
    this._rules = rules;
  }

  get id():string {
    return this._id;
  }

  set id(value:string) {
    this._id = value;
  }

  get type():string {
    return this._type;
  }

  set type(value:string) {
    this._type = value;
  }

  get text():string {
    return this._text;
  }

  set text(value:string) {
    this._text = value;
  }

  get answerValues():string[] {
    return this._answerValues;
  }

  set answerValues(value:string[]) {
    this._answerValues = value;
  }

  get answers():Answer[] {
    return this._answers;
  }

  set answers(value:Answer[]) {
    this._answers = value;
  }

  get project():Project {
    return this._project;
  }

  set project(value:Project) {
    this._project = value;
  }

  get rules():Rule[] {
    return this._rules;
  }

  set rules(value:Rule[]) {
    this._rules = value;
  }
}
