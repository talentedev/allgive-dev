import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { AuthService } from '../../auth.service'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-passwordless-auth',
  templateUrl: './passwordless-auth.component.html',
  styleUrls: ['./passwordless-auth.component.css']
})
export class PasswordlessAuthComponent implements OnInit {

  title: string = 'Log In | Allgive.org'
  emailSent: boolean = false
  loginForm = this.fb.group({
    email: ['', Validators.required]
  })

  constructor(private titleService: Title, private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.setTitle(this.title)
    const url = this.router.url
    this.confirmSignIn(url)
  }

  sendEmailLink() {
    const actionCodeSettings = environment.actionCodeSettings
    this.authService.emailLinkLogin(this.loginForm.value.email)
      .then((res) => {
        this.emailSent = true
      })
  }

  confirmSignIn(url) {
    this.authService.confirmSignIn(url)
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle)
  }
}
