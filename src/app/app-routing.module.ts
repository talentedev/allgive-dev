import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { title: 'Small Sacrifice, Big Difference'}
  },
  {
    path: 'faqs',
    component: FaqsComponent,
    data: {title: 'FAQs'},
    canActivate: [AuthGuard]
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
