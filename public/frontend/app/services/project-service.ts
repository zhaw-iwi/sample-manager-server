import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

import {Project} from '../models/project';
import {HttpService} from './http-service';

@Injectable()
export class ProjectService {
  private url:string = 'api/projects/';
  private http:HttpService;
  private

  constructor(private http: HttpService) {
    this.http = http;
  }

  /**
   * Get all projects
   * @returns {Observable<R>}
     */
  public getProjects(): any {
    return this.http.get(this.url)
      .map((res) => <Project[]> res.json())
      .catch(this.handleError);
  }

  /**
   * Get project by id
   * @param id
   * @returns {Observable<R>}
     */
  public getProjectById(id: string): any {
    return this.http.get(this.url + id)
      .map((res) => <Project> res.json())
      .catch(this.handleError);
  }

  /**
   * Create a project
   * @param project
   * @returns {Observable<R>}
     */
  public createProject(project: Project): any {
    return this.http.post(this.url, project)
      .map((res) => <Project> res.json())
      .catch(this.handleError);
  }

  /**
   * Update a project
   * @param project
   * @returns {Observable<R>}
     */
  public updateProject(project: Project): any {
    return this.http.put(this.url, project)
      .map((res) => <Project> res.json())
      .catch(this.handleError);
  }

  /**
   * Delete a project
   * @param id
   * @returns {Observable<R>}
     */
  public deleteProject(id: string): any {
    return this.http.delete(this.url + id)
      .map((res) => <Project> res.json())
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
