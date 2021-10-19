import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private authService: AuthService,
              private userService:UserService,
              private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated()
      .pipe(
        tap((authenticated) => {
          this.userService.isAuthenticated = authenticated;
          if (!authenticated) {
            this.router.navigateByUrl('qr');
          }
        })
      );
  }
}
