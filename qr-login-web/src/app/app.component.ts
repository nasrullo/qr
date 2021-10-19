import {Component} from '@angular/core';
import {IndicatorService} from "./services/indicator.service";
import {Router} from "@angular/router";
import {TokenService} from "./services/token.service";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public indicatorService: IndicatorService,
              private tokenService: TokenService,
              public userService: UserService,
              private router: Router) {
  }

  onClickLogout() {
    this.userService.isAuthenticated = false;
    this.tokenService.clear()
    this.router.navigateByUrl("qr")
  }
}
