import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

import {Record} from '../models/record';
import {HttpService} from './http-service';
import {RecordProject} from '../models/record-project';

@Injectable()
export class RecordService {
  private url:string = 'api/records/';
  private http:HttpService;

  constructor(private http: HttpService) {
    this.http = http;
  }

  /**
   * Get all records
   * @returns {Observable<R>}
     */
  public getRecords(): any {
    return this.http.get(this.url)
      .map((res) => <Record[]> res.json())
      .catch(this.handleError);
  }

  /**
   * Get record by id
   * @param id
   * @returns {Observable<R>}
     */
  public getRecordById(id: string): any {
    return this.http.get(this.url + id)
      .map((res) => <Record> res.json())
      .catch(this.handleError);
  }

  /**
   * Create a record
   * @param record
   * @returns {Observable<R>}
     */
  public createRecord(record: Record): any {
    return this.http.post(this.url, record)
      .map((res) => <Record> res.json())
      .catch(this.handleError);
  }

  /**
   * Update a record
   * @param record
   * @returns {Observable<R>}
     */
  public updateRecord(record: Record): any {
    return this.http.put(this.url, record)
      .map((res) => <Record> res.json())
      .catch(this.handleError);
  }

  /**
   * Delete a record
   * @param id
   * @returns {Observable<R>}
     */
  public deleteRecord(id: string): any {
    return this.http.delete(this.url + id)
      .map((res) => <Record> res.json())
      .catch(this.handleError);
  }

  /**
   * Handle request errors
   * @param error
   * @returns {Observable<T>}
     */
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'RecordService: Server error');
  }

  /**
   * Get all records
   * @returns {Observable<R>}
   */
  public getRecordsByProject(projectId: string): any {
    return this.http.get(this.url + 'project/' + projectId)
      .map((res) => <RecordProject[]> res.json())
      .catch(this.handleError);
  }

}


