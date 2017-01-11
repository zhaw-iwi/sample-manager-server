import {User} from './user';
import {Rule} from "./rule";

export class Answer {
  private _id:string;
  private _created:string;
  private _answerValue:string;
  private _location:string;
  private _user:User;
  private _rule:Rule;

  constructor(id:string, created:string, answerValue:string, location:string, user:User, rule:Rule) {
    this._id = id;
    this._created = created;
    this._answerValue = answerValue;
    this._location = location;
    this._user = user;
    this._rule = rule;
  }

  get id():string {
    return this._id;
  }

  set id(value:string) {
    this._id = value;
  }

  get created():string {
    return this._created;
  }

  set created(value:string) {
    this._created = value;
  }

  get answerValue():string {
    return this._answerValue;
  }

  set answerValue(value:string) {
    this._answerValue = value;
  }

  get location():string {
    return this._location;
  }

  set location(value:string) {
    this._location = value;
  }

  get user():User {
    return this._user;
  }

  set user(value:User) {
    this._user = value;
  }

  get rule():Rule {
    return this._rule;
  }

  set rule(value:Rule) {
    this._rule = value;
  }
}
