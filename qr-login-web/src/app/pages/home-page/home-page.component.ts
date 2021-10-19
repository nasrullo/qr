import {Component, OnInit} from '@angular/core';
import {User, UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  user: User | undefined;

  constructor(private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
        this.user = user
      },
      err => {
        this.snackBar.open(err.message)
      })
  }

}
