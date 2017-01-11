import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Observable} from 'rxjs/Observable';

import {User} from '../models/user';
import {LoginRequest} from '../models/login-request';
import {Headers} from 'angular2/http';
import {HttpService} from './http-service';
import {Project} from '../models/project';

@Injectable()
export class UserService {
  private url:string = 'api/users/';

  constructor(private http: HttpService) {
  }

  /**
   * Get all users
   * @returns {Observable<R>}
     */
  public getUsers(): any {
    return this.http.get(this.url)
      .map((res) => <User[]> res.json())
      .catch(this.handleError);
  }

  /**
   * Get user by id
   * @param id
   * @returns {Observable<R>}
     */
  public getUserById(id: string): any {
    return this.http.get(this.url + id)
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Create a user
   * @param user
   * @returns {Observable<R>}
     */
  public createUser(user: User): any {
    return this.http.post(this.url, user)
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Create a users for project
   * @param users
   * @returns {Observable<R>}
   */
  public createUsersForProject(users: User[]): any {
    return this.http.post(this.url + '/project', users)
      .map((res) => <User[]> res.json())
      .catch(this.handleError);
  }

  /**
   * Update a user
   * @param user
   * @returns {Observable<R>}
     */
  public updateUser(user: User): any {
    return this.http.put(this.url, user)
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Delete a user
   * @param id
   * @returns {Observable<R>}
     */
  public deleteUser(id: string): any {
    return this.http.delete(this.url + id)
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Authorize a user
   * @returns {Observable<R>}
   */
  public authorizeUser(): any {
    return this.http.get(this.url + 'authorize')
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Login a user
   * @param request
   * @returns {Observable<R>}
     */
  public loginUser(request: LoginRequest): any {
    return this.http.post(this.url + 'login', request)
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Logout a user
   * @returns {Observable<R>}
   */
  public logoutUser(): any {
    return this.http.get(this.url + 'logout')
      .map((res) => <User> res.json())
      .catch(this.handleError);
  }

  /**
   * Handle request errors
   * @param error
   * @returns {Observable<T>}
     */
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'UserService: Server error');
  }
}
