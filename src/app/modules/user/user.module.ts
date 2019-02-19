import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule  } from 'highcharts-angular';
import { NgxLoadingModule } from 'ngx-loading';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCardComponent } from './edit-card/edit-card.component';
import { DeleteCardComponent } from './delete-card/delete-card.component';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    HighchartsChartModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [UserComponent, DashboardComponent, ProfileComponent, EditProfileComponent, EditCardComponent, DeleteCardComponent],
  entryComponents: [
    EditCardComponent,
    DeleteCardComponent
  ]
})
export class UserModule { }
