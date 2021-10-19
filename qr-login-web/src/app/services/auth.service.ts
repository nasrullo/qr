import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TokenService} from "./token.service";


@Injectable()
export class AuthService {

  tokenValue = '';

  constructor(protected tokenService: TokenService) {
  }

  isAuthenticated(): Observable<boolean> {
    // return of(true)
    return this.tokenService.getToken()
      .pipe(
        map((token: string | null) => {
          if (token != null && this.tokenService.isValid(token)) {
            this.tokenValue = token.split('#diff=')[0];
            return true;
          }
          if (token) {
            this.tokenService.clear();
          }
          return false;
        })
      );
  }

}
