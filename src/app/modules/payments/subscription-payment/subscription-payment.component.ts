import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PaymentComponent } from '../payment/payment.component';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.css']
})
export class SubscriptionPaymentComponent {

  @Input() charity;

  donationElements = [
    {
      donationAmount: 2,
      donationFrequency: 'every day',
      stripeFrequency: 'day',
      active: false
    },
    {
      donationAmount: 10,
      donationFrequency: 'every week',
      stripeFrequency: 'week',
      active: false
    },
    {
      donationAmount: 50,
      donationFrequency: 'every month',
      stripeFrequency: 'month',
      active: false
    }
  ];

  donationAmount: string;
  donationFrequency: string;
  selectedDonation;
  submitActive = false;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private userService: UserService
    ) { }

  selectDonationAmount(donation) {
    this.donationAmount = donation.donationAmount;
    this.donationFrequency = donation.stripeFrequency;

    this.donationElements.forEach(element => {
      if (element !== donation) {
        element.active = false;
      }

      if (this.selectedDonation && element === this.selectedDonation) {
        element.active = false;
        this.selectedDonation = null;
      }
    });

    this.selectedDonation = donation;
    this.selectedDonation.active = true;
    this.submitActive = true;
  }

  open() {
    if (this.submitActive) {
      this.userService.getUserCards().subscribe(cards => {
        const modalRef = this.modalService.open(PaymentComponent);
        modalRef.componentInstance.charity = this.charity;
        modalRef.componentInstance.cards = cards;
        modalRef.componentInstance.donation = this.selectedDonation;
        this.activeModal.close();
      });
    }
  }
}
