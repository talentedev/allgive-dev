import { Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

import { PaymentComponent } from '../payment/payment.component';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-custom-donation',
  templateUrl: './custom-donation.component.html',
  styleUrls: ['./custom-donation.component.scss']
})
export class CustomDonationComponent implements OnInit {

  donationAmount = 10;
  donationSchedule = 'week';
  charity;
  modals = [];

  constructor(
    public modalRef: MDBModalRef,
    private modalService: MDBModalService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.modals.push(this.modalRef);
  }

  next() {
    const selectedDonation = {
      donationAmount: this.donationAmount,
      stripeFrequency: this.donationSchedule,
      donationFrequency: 'every ' + this.donationSchedule
    };
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
          donation: selectedDonation,
          modals: this.modals
        }
      };
      this.modalService.show(PaymentComponent, modalOptions);
    });
  }

}
