import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule  } from 'highcharts-angular';
import { NgxLoadingModule } from 'ngx-loading';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCardComponent } from './edit-card/edit-card.component';
import { DeleteCardComponent } from './delete-card/delete-card.component';
import { StackedChartComponent } from './stacked-chart/stacked-chart.component';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserRoutingModule,
    HighchartsChartModule,
    NgxLoadingModule.forRoot({}),
    ChartsModule,
    WavesModule
  ],
  declarations: [
    UserComponent,
    DashboardComponent,
    ProfileComponent,
    EditProfileComponent,
    EditCardComponent,
    DeleteCardComponent,
    StackedChartComponent
  ],
  entryComponents: [
    EditCardComponent,
    DeleteCardComponent
  ]
})
export class UserModule { }
