import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";

import { PaymentConfirmationComponent } from '../payment-confirmation/payment-confirmation.component';
import { AuthService } from '../../auth.service';
import { PaymentsService } from '../../payments.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Input() charity;
  @Input() donation;

  error: string;
  name: string;
  email: string;
  authState;
  source;

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

  open(form: NgForm) {
    const modalRef = this.modalService.open(PaymentConfirmationComponent);
    // this.payments.checkForCustomerSource(this.authState)
    // .subscribe(source => {
    //   if (source) {
    //     this.source = source;
    //   }

      modalRef.componentInstance.source = this.source;
      modalRef.componentInstance.charity = this.charity;
      modalRef.componentInstance.donation = this.donation;
      modalRef.componentInstance.card = this.card;
      modalRef.componentInstance.prevModal = this.activeModal;
      modalRef.componentInstance.name = this.name;
      modalRef.componentInstance.email = this.email;
    // });
  }
}
