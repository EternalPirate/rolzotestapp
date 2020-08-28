import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';


export interface UserData {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getUserData(uid: string): Observable<UserData> {
    return this.httpClient.get(environment.firebase.databaseURL + `/users/${uid}.json`) as Observable<UserData>;
  }

  putUserData(uid: string, data: UserData): Observable<any> {
    return this.httpClient.put(environment.firebase.databaseURL + `/users/${uid}.json`, data) as Observable<any>;
  }
}
