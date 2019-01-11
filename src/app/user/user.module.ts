import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule  } from 'highcharts-angular';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    UserRoutingModule,
    HighchartsChartModule 
  ],
  declarations: [UserComponent, DashboardComponent, ProfileComponent, EditProfileComponent]
})
export class UserModule { }
