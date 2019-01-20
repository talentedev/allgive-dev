import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-global-navbar',
  templateUrl: './global-navbar.component.html',
  styleUrls: ['./global-navbar.component.css']
})
export class GlobalNavbarComponent implements OnInit {

  user: Observable<firebase.User>;
  authState;
  menuState = false;

  constructor(public authService: AuthService, private router: Router) {
    this.authState = this.authService.authState;
  }

  ngOnInit() {
    //
  }

  goToDashboard() {
    if (this.authService.authState) {
      this.router.navigate(['/user/dashboard']);
    } else {
      this.router.navigate(['/charities']);
    }
    this.menuState = false;
  }

  collapseMenu() {
    this.menuState = false;
    const url = this.router.url;
    if (url === '/charities') {
      location.reload();
    }
  }

  logout() {
    this.authService.signOut();
  }

}
