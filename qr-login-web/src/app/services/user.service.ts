import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "./api-base-url.injection";
import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";

export interface User {
  email: string;
  age: number;
  name: string;
  type: string;
}

@Injectable()
export class UserService {
  isAuthenticated = false

  constructor(@Inject(API_BASE_URL) private apiUrl: string,
              private http: HttpClient) {
  }


  getUser(): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/info")
  }

}
