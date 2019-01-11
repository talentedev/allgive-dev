import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Authorization': 'apikey ' + environment.mailchimpKey, 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class MailChimpService {

  private endpoint : string = 'https://us7.api.mailchimp.com/3.0/';

  constructor(
    private http: HttpClient
  ) { }

  /** Subscribe user */
  subscribeUser(): Observable<any> {
    return this.http.get(this.endpoint + 'lists', httpOptions)
      .pipe(
        tap(res => console.log(res)),
      );
  }
}
