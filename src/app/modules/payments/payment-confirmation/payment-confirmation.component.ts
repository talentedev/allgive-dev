import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MDBModalRef } from 'angular-bootstrap-md';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

import { PaymentsService } from '../../../core/services/payments.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {

  charity;
  donation;
  customer;
  token;

  authState;
  invalidCard = false;
  errorMessage = '';

  constructor(
    private modalRef: MDBModalRef,
    private payments: PaymentsService,
    private router: Router,
    private auth: AuthService,
    private stripeService: StripeService
  ) { }

  ngOnInit() {
    this.authState = this.auth.authState;
  }

  onSubmit() {
    this.invalidCard = false;
    this.errorMessage = '';
    // Convert charge amount to pennies for Stripe
    const stripeAmount = this.donation.donationAmount * 100;
    const data = {
      donation: stripeAmount,
      frequency: this.donation.stripeFrequency,
      user: this.authState,
      charity: this.charity,
      token: this.token,
      customer: this.customer
    };

    if (this.token) {
      this.payments.processNewSubscription(data)
        .subscribe(res => {
          if (res.message) {
            this.invalidCard = true;
            this.errorMessage = res.message;
          } else {
            this.modalRef.hide();
            this.router.navigate(['/user/dashboard']);
          }
        });
    } else {
      this.payments.processSubscription(data)
        .subscribe(res => {
          if (res.message) {
            this.invalidCard = true;
            this.errorMessage = res.message;
          } else {
            this.modalRef.hide();
            this.router.navigate(['/user/dashboard']);
          }
        });
    }
  }
}
