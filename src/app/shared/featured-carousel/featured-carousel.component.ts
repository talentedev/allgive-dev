import { Component, OnInit, Input } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Entry } from 'contentful';

import { ContentfulService } from '../../core/services/contentful.service';

@Component({
  selector: 'app-featured-carousel',
  templateUrl: './featured-carousel.component.html',
  styleUrls: ['./featured-carousel.component.css']
})
export class FeaturedCarouselComponent implements OnInit {

  heroStyle: {};
  charities: Entry<any>[] = [];
  showNavigationArrows = false;
  showNavigationIndicators = false;

  constructor(config: NgbCarouselConfig, private contentfulService: ContentfulService) {
    config.interval = 10000;

  }

  ngOnInit() {
    return this.contentfulService.getFeaturedCharities()
      .then(res => {
        this.charities = res;
        console.log(res);
      });
  }
}
