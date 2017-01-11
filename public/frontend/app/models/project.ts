import {Measure} from './measure';
import {User} from './user';
import {Trigger} from './trigger';

export class Project {
  public _id:string;
  public name:string;
  public created:string;
  public createdDate:Date;
  public finish:string;
  public finishDate:Date;
  public measures:Measure[];
  public triggers:Trigger[];
  public users:User[];
  public imageUrl:string;

  constructor() {
  }


}
