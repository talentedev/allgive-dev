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

  authState;

  constructor(
    public activeModal: NgbActiveModal,
    private payments: PaymentsService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.authState = this.auth.authState();
  }

  onSubmit() {
    return stripe.createToken(this.card)
      .then(result => {
        if (result.error) {
          return console.log('Something went wrong', result.error);
        } else {
          // Convert charge amount to pennies for Stripe
          let stripeAmount = this.donation.donationAmount * 100;
          
          let data = {
            donation: stripeAmount,
            frequency: this.donation.donationFrequency,
            user: this.authState,
            charity: this.charity
          }
          this.payments.processSubscription(result.token.id, data)
            .subscribe(data => this.router.navigate(['/user/dashboard']));
        }
      });
  }

}
