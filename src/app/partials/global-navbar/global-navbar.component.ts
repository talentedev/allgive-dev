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

  constructor(public authService: AuthService) {
    this.authState = this.authService.authState;
  }

  ngOnInit() {
    // 
  }

  logout() {
    this.authService.signOut();
  }

}
