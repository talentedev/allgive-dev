import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

import { PaymentConfirmationComponent } from '../payment-confirmation/payment-confirmation.component';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentsService } from '../../../core/services/payments.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Input() charity;
  @Input() donation;
  @Input() cards;

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
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
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

  open(form: NgForm) {
    this.invalidCard = false;
    this.errorMessage = '';

    if (this.isNewCard) {
      this.stripeService.createToken(this.card, {}).subscribe(result => {
        if (result.token) {
          const modalRef = this.modalService.open(PaymentConfirmationComponent);
          modalRef.componentInstance.token = result.token;
          modalRef.componentInstance.charity = this.charity;
          modalRef.componentInstance.donation = this.donation;
          modalRef.componentInstance.prevModal = this.activeModal;
          modalRef.componentInstance.name = this.name;
          modalRef.componentInstance.email = this.email;
        } else {
          this.invalidCard = true;
          this.errorMessage = result.error.message;
        }
      });
    } else {
      const modalRef = this.modalService.open(PaymentConfirmationComponent);
      modalRef.componentInstance.token = null;
      modalRef.componentInstance.charity = this.charity;
      modalRef.componentInstance.donation = this.donation;
      modalRef.componentInstance.customer = this.selectedCard.customer;
      modalRef.componentInstance.prevModal = this.activeModal;
      modalRef.componentInstance.name = this.name;
      modalRef.componentInstance.email = this.email;
    }
  }
}
