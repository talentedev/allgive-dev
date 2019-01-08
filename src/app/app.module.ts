import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgxStripeModule } from 'ngx-stripe';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CharitiesModule } from './charities/charities.module';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainComponent } from './main/main.component';
import { ContentfulService } from './contentful.service';
import { ContentfulPreviewService } from './contentful-preview.service';
import { PartialsModule } from './partials/partials.module';
import { FaqsComponent } from './faqs/faqs.component';
import { TitleService } from './title.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsService } from './payments.service';
import { ContactComponent } from './contact/contact.component';
import { SubscriptionPaymentComponent } from './payments/subscription-payment/subscription-payment.component';
import { PaymentComponent } from './payments/payment/payment.component';
import { PaymentConfirmationComponent } from './payments/payment-confirmation/payment-confirmation.component';
import { PagesModule } from './pages/pages.module';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MainComponent,
    FaqsComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxStripeModule.forRoot('pk_test_A1hL1cLlXqg5ObWRn1eaIgXU'),
    NgbModule.forRoot(),
    PartialsModule,
    CharitiesModule,
    UserModule,
    AuthModule,
    PaymentsModule,
    PagesModule,
    AppRoutingModule,
  ],
  providers: [ HttpClient, Title, ContentfulService, ContentfulPreviewService, TitleService, AuthService, AuthGuard, PaymentsService ],
  bootstrap: [ AppComponent ],
  entryComponents: [ 
    SubscriptionPaymentComponent, 
    PaymentComponent,
    PaymentConfirmationComponent
  ]
})
export class AppModule { }
