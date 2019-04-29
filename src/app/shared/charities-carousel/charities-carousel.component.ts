import { Component, Input, OnInit } from '@angular/core';
import { Entry } from 'contentful';
import { map } from 'rxjs/operators';

import { ContentfulService } from '../../core/services/contentful.service';

@Component({
  selector: 'app-charities-carousel',
  templateUrl: './charities-carousel.component.html',
  styleUrls: ['./charities-carousel.component.scss']
})
export class CharitiesCarouselComponent implements OnInit {

  @Input() carouselType: string;
  charities: Entry<any>[];
  cardCount;
  slideConfig;
  currentSlide = 1;

  constructor(
    private contentfulService: ContentfulService
  ) {}

  chunk(arr, chunkSize) {
    const R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  ngOnInit() {
    if (window.screen.width < 576) {
      this.cardCount = 3;
    } else {
      this.cardCount = 6;
    }
    this.slideConfig = {
      autoplay: true,
      infinite: true,
      arrows: false,
      slidesToShow: this.cardCount,
      slidesToScroll: 1
    };
    this.contentfulService.getCharities()
      .then(res => {
        this.charities = res;
      });
  }

  afterChange(e) {
    this.currentSlide = e.currentSlide;
  }
}
