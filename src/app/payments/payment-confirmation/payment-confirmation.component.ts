import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.authState = this.auth.authState;
  }

  onSubmit() {
    return stripe.createToken(this.card)
      .then(result => {
        if (result.error) {
          return console.log('Something went wrong', result.error);
        } else {
          // Convert charge amount to pennies for Stripe
          const stripeAmount = this.donation.donationAmount * 100;

          const data = {
            donation: stripeAmount,
            frequency: this.donation.donationFrequency,
            user: this.authState,
            charity: this.charity
          };
          console.log(result);
          this.activeModal.dismiss();
          this.prevModal.dismiss();
          this.router.navigate(['/charities'])
          // this.payments.processSubscription(result.token.id, data)
          //   .subscribe(res => this.router.navigate(['/user/dashboard']));
        }
      });
  }

}
