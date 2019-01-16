import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user;
  title = 'Log In | Allgive.org';

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) { }

  loginForm = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });

  ngOnInit() {
    if (this.authService.authState) {
      this.router.navigate(['/charities']);
    }

    this.setTitle(this.title);
  }

  onSubmit() {
    this.authService.emailLogin(this.loginForm.value.email, this.loginForm.value.password);
  }

  goPasswordlessLogin() {
    this.router.navigate(['/link-login']);
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
