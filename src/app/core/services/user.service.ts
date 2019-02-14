import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUserInfo(): Observable<any> {
    let endpoint = this.apiUrl + '/getUserInfo';
    let requestData = {
      uid: this.authService.authState.uid
    }
    return this.http.post(endpoint, requestData);
  }

  getUserCards(): Observable<any> {
    let endpoint = this.apiUrl + '/user-cards';
    let requestData = {
      email: this.authService.authState.email
    }
    return this.http.post(endpoint, requestData);
  }
}
