import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';


@Injectable()
export class HttpService {
  //private host:string = 'https://mighty-everglades-95815.herokuapp.com/';
  private host:string = 'http://localhost:3001/';

  constructor(private _http: Http) {
  }

  private createHeaders() {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    return {headers: headers};
  }

  public get(url:string) {
    return this._http.get(this.host + url, this.createHeaders());
  }

  public post(url:string, data:Object) {
    return this._http.post(this.host + url, JSON.stringify(data), this.createHeaders());
  }

  public put(url:string, data:Object) {
    return this._http.put(this.host + url, JSON.stringify(data), this.createHeaders());
  }

  public delete(url:string) {
    return this._http.delete(this.host + url, this.createHeaders());
  }
}
