import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'custom-modal', 
  template: `
    <div class="modal-body text-center">
      <h3 class="modal-title text-danger">Invalid Link!</h3>
      <p>The link is expired.</p>
      <p>Please try to get link again.</p>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">OK</button>
    </div>
  `
})
export class CustomModal {
  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-passwordless-auth',
  templateUrl: './passwordless-auth.component.html',
  styleUrls: ['./passwordless-auth.component.css']
})
export class PasswordlessAuthComponent implements OnInit {

  public loading = false;
  title = 'Log In | Allgive.org';
  emailSent = false;
  loginForm = this.fb.group({
    email: ['', Validators.required]
  });

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
   ) { }

  ngOnInit() {
    this.setTitle(this.title);
    const url = this.router.url;
    if(url !== '/link-login') {
      this.confirmSignIn(url);
    }
  }

  sendEmailLink() {
    const actionCodeSettings = environment.actionCodeSettings;
    this.authService.emailLinkLogin(this.loginForm.value.email)
      .then((res) => {
        this.emailSent = true;
      });
  }

  confirmSignIn(url) {
    this.loading = true;
    this.authService.confirmSignIn(url)
      .then(res => { this.loading = false; },
            err => {
              this.loading = false;
              this.modalService.open(CustomModal, { centered: true, size: "lg" });
            });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
