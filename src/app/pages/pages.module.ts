import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PartialsModule } from '../partials/partials.module';
import { PagesComponent } from './pages.component';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    PagesRoutingModule,
  ],
  declarations: [PagesComponent, PageWrapperComponent]
})
export class PagesModule { }
