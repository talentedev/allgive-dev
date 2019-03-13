import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputsModule, ButtonsModule } from 'angular-bootstrap-md';

import { PaymentsRouterModule } from './payments-router.module';
import { PaymentComponent } from './payment/payment.component';
import { SubscriptionPaymentComponent } from './subscription-payment/subscription-payment.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaymentsRouterModule,
    InputsModule,
    ButtonsModule
  ],
  declarations: [
    PaymentComponent,
    SubscriptionPaymentComponent,
    PaymentConfirmationComponent
  ]
})
export class PaymentsModule { }
