import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

import { AuthService } from '../../../core/services/auth.service';
import { PaymentsService } from '../../../core/services/payments.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddNewCardComponent implements OnInit {
  @Input() cards;
  @Input() selectedCard;
  selectedOption = 'deleteAll';
  availableCards = [];
  assignedCard;
  faSpinner = faSpinner;
  modals = [];

  error: string;
  name: string;
  email: string;
  authState;
  invalidCard = false;
  errorMessage = '';
  isNewCard = true;
  isSubmitting;
  elements: Elements;
  card: StripeElement;
  isBack = false;
  isProcessing = false;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: MDBModalService,
    private auth: AuthService,
    private payments: PaymentsService,
    private stripeService: StripeService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.stripeService.elements()
    .subscribe(elements => {
      this.elements = elements;
      console.log('@----', this.elements);
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

    if (this.selectedCard === null || this.selectedCard === undefined) {
      this.isNewCard = true;
    }

    this.isProcessing = false;
    this.authState = this.auth.authState;
  }

  onDelete() {
    this.selectedOption = 'deleteAll';
  }

  onAssign() {
    this.selectedOption = 'assignCard';
  }

  onSelectCard(card) {
    this.assignedCard = card;
  }

  onAddCard() {
    this.isProcessing = true;
    this.stripeService.createToken(this.card, {}).subscribe(async(result) => {
      if (result.token) {
        const data = {
          user: this.authState,
          token: result.token,
        };
        this.payments.addNewCard(data)
          .subscribe(res => {
            console.log('@----res---', res);
            if (res.message === 'success') {
              this.errorMessage = res.message;
              this.closeModal(true);
              return;
            } else {
              this.errorMessage = res.message;
              this.closeModal(false);
            }
          });
      } else {
        this.isProcessing = false;
        this.invalidCard = true;
        this.errorMessage = result.error.message;
      }
    });
  }

  closeModal(bSuccess) {
    if (bSuccess)  {
      this.activeModal.dismiss('success');
    } else {
      this.activeModal.close();
    }
  }

  back() {
    this.activeModal.close();
  }
}
