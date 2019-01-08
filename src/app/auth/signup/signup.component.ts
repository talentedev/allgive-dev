import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user;
  title: string = 'Sign Up | Allgive.org';

  constructor(private titleService: Title, private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    if (this.authService.authState) {
      this.router.navigate(['/charities']);
    }

    this.setTitle(this.title);
  }

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    this.authService.emailSignUp(
      this.signupForm.value.firstName,
      this.signupForm.value.lastName,
      this.signupForm.value.email,
      this.signupForm.value.password
    )
      .then((res) => { this.router.navigate(['/charities']) })
      .catch(error => {
        console.log(error);

    })
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
