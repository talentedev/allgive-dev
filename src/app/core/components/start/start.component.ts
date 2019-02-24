import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { MailChimpService } from '../../../core/services/mailchimp.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  title = 'Get started | Allgive.org';
  invalid = false;
  errorMessage = '';

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private mailchimpService: MailChimpService
  ) { }

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email]
  });

  ngOnInit() {
    this.setTitle(this.title);
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onSubmit() {
    this.invalid = false;
    this.errorMessage = '';

    this.authService.emailSignUp(
      this.signupForm.value.firstName,
      this.signupForm.value.lastName,
      this.signupForm.value.email,
      '1234567'
    )
      .then((res) => {
        this.router.navigate(['/charities']);

        // Subscribe user to mailchimp
        this.mailchimpService.subscribeUser(
          this.signupForm.value.firstName,
          this.signupForm.value.lastName,
          this.signupForm.value.email
        );
      })
      .catch(error => {
        this.invalid = true;
        this.errorMessage = error.message;
    });
  }

}
