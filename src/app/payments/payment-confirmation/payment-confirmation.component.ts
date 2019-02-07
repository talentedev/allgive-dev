import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";

import { PaymentsService } from '../../payments.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {

  @Input() charity;
  @Input() donation;
  @Input() card;
  @Input() prevModal;

  authState;

  constructor(
    public activeModal: NgbActiveModal,
    private payments: PaymentsService,
    private router: Router,
    private auth: AuthService,
    private stripeService: StripeService
  ) { }

  ngOnInit() {
    this.authState = this.auth.authState;
  }

  onSubmit() {
    const name = 'name';
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Convert charge amount to pennies for Stripe
          const stripeAmount = this.donation.donationAmount * 100;
          const data = {
            donation: stripeAmount,
            frequency: this.donation.donationFrequency,
            user: this.authState,
            charity: this.charity
          };
          this.activeModal.dismiss();
          this.prevModal.dismiss();
          this.router.navigate(['/user/dashboard']);
          // this.payments.processSubscription(result.token.id, data)
          //   .subscribe(res => this.router.navigate(['/user/dashboard']));
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }
}
