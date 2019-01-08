import { Component, OnInit } from '@angular/core';
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
  menuState: boolean = false;
  mobileVersion: boolean = false;

  constructor(public authService: AuthService) {
    this.authState = this.authService.authState;
  }

  ngOnInit() {
    if (window.screen.width < 414) {
      this.mobileVersion = true;
    } else {
      this.mobileVersion = false;
    }
  }

  toggleMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.menuState = !this.menuState;

  }

  logout() {
    this.authService.signOut();
  }

}
