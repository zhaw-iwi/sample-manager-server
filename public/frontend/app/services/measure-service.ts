import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

import {Measure} from '../models/measure';
import {HttpService} from './http-service';

@Injectable()
export class MeasureService {
  private url:string = 'api/measures/';
  private http:HttpService;

  constructor(private http: HttpService) {
    this.http = http;
  }

  /**
   * Get all measures
   * @returns {Observable<R>}
     */
  public getMeasures(): any {
    return this.http.get(this.url)
      .map((res) => <Measure[]> res.json())
      .catch(this.handleError);
  }

  /**
   * Get measure by id
   * @param id
   * @returns {Observable<R>}
     */
  public getMeasureById(id: string): any {
    return this.http.get(this.url + id)
      .map((res) => <Measure> res.json())
      .catch(this.handleError);
  }

  /**
   * Create a measure
   * @param measure
   * @returns {Observable<R>}
     */
  public createMeasure(measure: Measure): any {
    return this.http.post(this.url, measure)
      .map((res) => <Measure> res.json())
      .catch(this.handleError);
  }

  /**
   * Update a measure
   * @param measure
   * @returns {Observable<R>}
     */
  public updateMeasure(measure: Measure): any {
    return this.http.put(this.url, measure)
      .map((res) => <Measure> res.json())
      .catch(this.handleError);
  }

  /**
   * Delete a measure
   * @param id
   * @returns {Observable<R>}
     */
  public deleteMeasure(id: string): any {
    return this.http.delete(this.url + id)
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
    return Observable.throw(error.json().error || 'MeasureService: Server error');
  }
}
