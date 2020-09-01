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

  /**
   * Get user data from firebase
   * @param uid - user uid
   * @return firebase user data model
   */
  getUserData(uid: string): Observable<UserData> {
    return this.httpClient.get(environment.firebase.databaseURL + `/users/${uid}.json`) as Observable<UserData>;
  }

  /**
   * Update user data in firebase
   * @param uid - user uid
   * @param data - firebase user data model
   * @return firebase user data model
   */
  putUserData(uid: string, data: UserData): Observable<UserData> {
    return this.httpClient.put(environment.firebase.databaseURL + `/users/${uid}.json`, data) as Observable<UserData>;
  }
}
