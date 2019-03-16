import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

import { PaymentComponent } from '../payment/payment.component';
import { CustomDonationComponent } from '../custom-donation/custom-donation.component';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss']
})
export class SubscriptionPaymentComponent {

  charity: any;

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
      active: true
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
  selectedDonation = this.donationElements[1];

  constructor(
    public modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private userService: UserService
    ) { }

  selectDonationAmount(donation, index) {
    if (index !== 2) {
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
    } else {
      this.customizeDonation();
    }
  }

  open() {
    this.userService.getUserCards().subscribe(cards => {
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
          charity: this.charity,
          cards: cards,
          donation: this.selectedDonation,
          modals: [this.modalRef]
        }
      };
      this.modalService.show(PaymentComponent, modalOptions);
    });
  }

  customizeDonation() {
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
        charity: this.charity,
        modals: [this.modalRef]
      }
    };
    this.modalService.show(CustomDonationComponent, modalOptions);
  }
}
