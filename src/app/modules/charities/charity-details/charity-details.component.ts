import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Entry } from 'contentful';

import { AuthService } from '../../../core/services/auth.service';
import { ContentfulService } from '../../../core/services/contentful.service';
import { ContentfulPreviewService } from '../../../core/services/contentful-preview.service';
import { SubscriptionPaymentComponent } from '../../payments/subscription-payment/subscription-payment.component';

@Component({
  selector: 'app-charity-details',
  templateUrl: './charity-details.component.html',
  styleUrls: ['./charity-details.component.css']
})
export class CharityDetailsComponent implements OnInit {

  charity: Entry<any>;
  carouselType: String = 'Related Organizations';
  coverStyle: {};
  logoStyle: {};
  title: string;
  charityName = '';
  charityCategory = '';
  modalRef: MDBModalRef;

  constructor(
    private titleService: Title,
    private contentfulService: ContentfulService,
    private contenfulPreviewService: ContentfulPreviewService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: MDBModalService,
    private auth: AuthService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
        window.scroll(0, 0);
      }
    });
  }

  ngOnInit() {
    const pathSegment = this.route.snapshot.pathFromRoot[1].url[0].path;
    const charityId = this.route.snapshot.paramMap.get('slug');
    if (pathSegment === 'preview') {
      console.log('this is the preview view');
      console.log('charityId', charityId);
      this.contenfulPreviewService.previewCharityDetail(charityId)
        .then(res => {
          console.log('res', res);
          this.charity = res;
          this.charityName = this.charity.fields.charityName;
          this.charityCategory = this.charity.fields.category.fields.categoryName;
          this.title = 'Preview | ' + this.charity.fields.charityName + ' | Allgive.org';
          this.setTitle(this.title);
          this.coverStyle = {
            'background-image': 'url(' + this.charity.fields.coverImage.fields.file.url + ')',
            'background-position': 'center 20%',
            'background-size': 'cover',
            'margin-bottom': '7vw'
          };
          this.logoStyle = {
            'background-image': 'url(' + this.charity.fields.logo.fields.file.url + ')',
            'background-size': 'cover',
            'position': 'absolute',
            'overflow': 'hidden',
            'width': '10vw',
            'height': '10vw',
            'bottom': '-5vw',
            'left': '0',
            'right': '0',
            'margin': 'auto',
            'text-indent': '-10rem'
          };
        });
    } else {
      this.contentfulService.getCharityDetail(charityId)
        .then(res => {
          this.charity = res;
          this.charityName = this.charity.fields.charityName;
          this.charityCategory = this.charity.fields.category.fields.categoryName;
          this.title = this.charity.fields.charityName + ' | Allgive.org';
          this.setTitle(this.title);
          this.coverStyle = {
            'background-image': 'url(' + this.charity.fields.coverImage.fields.file.url + ')',
            'background-position': 'center 20%',
            'background-size': 'cover',
            'margin-bottom': '7vw'
          };
          this.logoStyle = {
            'background-image': 'url(' + this.charity.fields.logo.fields.file.url + ')',
            'background-size': 'cover',
            'position': 'absolute',
            'overflow': 'hidden',
            'width': '10vw',
            'height': '10vw',
            'bottom': '-5vw',
            'left': '0',
            'right': '0',
            'margin': 'auto',
            'text-indent': '-10rem'
          };
        });
    }
  }

  public setTitle( newTitle: string ) {
    this.titleService.setTitle( newTitle );
  }

  open() {
    if (this.auth.authState) {
      const modalOptions = {
        backdrop: true,
        keyboard: true,
        focus: true,
        show: false,
        ignoreBackdropClick: false,
        class: '',
        containerClass: '',
        animated: true,
        data: {
            charity: this.charity
        }
      };
      this.modalService.show(SubscriptionPaymentComponent, modalOptions);
    } else {
      this.router.navigate(['/start']);
    }
  }
}
