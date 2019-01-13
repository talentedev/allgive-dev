import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-global-footer',
  templateUrl: './global-footer.component.html',
  styleUrls: ['./global-footer.component.css']
})
export class GlobalFooterComponent implements OnInit {

  authState;

  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();

  constructor(public authService: AuthService) {
    this.authState = this.authService.authState;
  }

  ngOnInit() {
  }

}
