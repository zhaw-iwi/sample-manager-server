import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

import {Project} from '../models/project';
import {HttpService} from './http-service';
import {Measure} from '../models/measure';

@Injectable()
export class ActionService {
  private url:string = 'api/actions/';

  constructor(private http: HttpService) {
  }

  /**
   * Delete a project
   * @param id
   * @returns {Observable<R>}
   */
  public startProject(id: string): any {
    return this.http.get(this.url + 'start/' + id)
      .map((res) => <Project> res.json())
      .catch(this.handleError);
  }

  /**
   * Delete a project
   * @param id
   * @returns {Observable<R>}
   */
  public restartProject(id: string): any {
    return this.http.get(this.url + 'restart/' + id)
      .map((res) => <Project> res.json())
      .catch(this.handleError);
  }

  /**
   * Trigger measure manually
   * @param id
   * @returns {Observable<R>}
   */
  public triggerManual(id: string): any {
    return this.http.post(this.url + 'manualtrigger/' + id, undefined)
      .map((res) => <Measure> res.json())
      .catch(this.handleError);
  }


  /**
   * Handle request errors
   * @param error
   * @returns {Observable<T>}
     */
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'ProjectService: Server error');
  }
}
