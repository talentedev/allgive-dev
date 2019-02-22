import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './core/components/main/main.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { FaqsComponent } from './core/components/faqs/faqs.component';
import { StartComponent } from './core/components/start/start.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { title: 'Small Sacrifice, Big Difference'}
  },
  {
    path: 'faqs',
    component: FaqsComponent,
    data: {title: 'FAQs'}
  },
  {
    path: 'start',
    component: StartComponent,
    data: {title: 'Get started'}
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {title: 'Page not found'}
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
