import { Component, Input, OnInit } from '@angular/core';
import { ContentfulService } from '../../contentful.service';
import { Entry } from 'contentful';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-charities-carousel',
  templateUrl: './charities-carousel.component.html',
  styleUrls: ['./charities-carousel.component.css']
})
export class CharitiesCarouselComponent implements OnInit {

  @Input('carouselType') carouselType: string;
  charities: Entry<any>[];
  mobile: boolean = false;

  constructor(private contentfulService: ContentfulService, private config: NgbCarouselConfig) {
    config.interval = 15000;
  }

  ngOnInit() {
    if (window.screen.width < 414) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    return this.contentfulService.getCharities()
      .then(res => this.charities = res);
  }

  // getCharities() {
  //   return this.contentfulService.getCharities()
  //     .then((res) => this.charities = res)
  // }
}
