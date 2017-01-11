export class Rule {
  public _id:string;
  public begin:number;
  public end:number;
  public repeats:number;

  constructor(begin:number, end:number, repeats:number) {
    this.begin = begin;
    this.end = end;
    this.repeats = repeats;
  }


}
