import {User} from './user';

export class Record {
  public _id:string;
  public created:string;
  public value:string;
  public location:[number];
  public user:User;

  constructor() {
  }
}
