import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentConfirmationComponent } from '../payment-confirmation/payment-confirmation.component';
import { AuthService } from '../../auth.service';
import { PaymentsService } from '../../payments.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cardInfo') cardInfo: ElementRef;
  @Input() charity;
  @Input() donation;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  name: string;
  email: string;
  authState;
  source;

  constructor(
    private cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private auth: AuthService,
    private payments: PaymentsService
  ) { }

  ngAfterViewInit() {
    this.card = elements.create('card', {
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
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);

    this.authState = this.auth.authState();
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }

    this.cd.detectChanges();
  }

  open(form: NgForm) {
    const modalRef = this.modalService.open(PaymentConfirmationComponent);
    this.payments.checkForCustomerSource(this.authState)
    .subscribe(source => {
      if (source) {
        this.source = source;
      }
        
      modalRef.componentInstance.source = this.source;
      modalRef.componentInstance.charity = this.charity;
      modalRef.componentInstance.donation = this.donation;
      modalRef.componentInstance.card = this.card;
    });
    
  }
}
