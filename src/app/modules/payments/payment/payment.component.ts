import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

import { PaymentConfirmationComponent } from '../payment-confirmation/payment-confirmation.component';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  charity;
  donation;
  cards;

  error: string;
  name: string;
  email: string;
  authState;
  invalidCard = false;
  errorMessage = '';
  isNewCard = true;
  selectedCard = null;

  elements: Elements;
  card: StripeElement;

  constructor(
    public modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private auth: AuthService,
    private payments: PaymentsService,
    private stripeService: StripeService
  ) { }

  ngOnInit() {
    this.stripeService.elements()
      .subscribe(elements => {
        this.elements = elements;
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
          this.authState = this.auth.authState;
        }
      });
  }

  onChangeCard(card) {
    if (card) {
      this.isNewCard = false;
      this.selectedCard = card;
    } else {
      this.isNewCard = true;
    }
  }

  open() {
    this.invalidCard = false;
    this.errorMessage = '';

    if (this.isNewCard) {
      this.stripeService.createToken(this.card, {}).subscribe(result => {
        if (result.token) {
          const modalOptions = {
            backdrop: true,
            keyboard: true,
            focus: true,
            show: false,
            ignoreBackdropClick: false,
            class: '',
            containerClass: '',
            animated: true,
            data: {
                token: result.token,
                charity: this.charity,
                donation: this.donation,
                name: this.name,
                email: this.email
            }
          };
          this.modalService.show(PaymentConfirmationComponent, modalOptions);
          this.modalRef.hide();
        } else {
          this.invalidCard = true;
          this.errorMessage = result.error.message;
        }
      });
    } else {
      const modalOptions = {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
            token: null,
            charity: this.charity,
            donation: this.donation,
            customer: this.selectedCard.customer,
            name: this.name,
            email: this.email
        }
      };
      this.modalService.show(PaymentConfirmationComponent, modalOptions);
      this.modalRef.hide();
    }
  }
}
