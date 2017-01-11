import {Project} from './project';

export class User {
  public _id:string;
  public username:string;
  public email:string;
  public password:string;
  public gcmToken:string;
  public projects:any[];
  public checked:boolean;

  constructor() {
  }
}
