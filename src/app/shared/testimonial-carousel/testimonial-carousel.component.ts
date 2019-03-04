import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css']
})
export class TestimonialCarouselComponent implements OnInit {

  testimonials = [];

  constructor(config: NgbCarouselConfig) {
    config.interval = 10000;
  }

  ngOnInit() {
    this.testimonials = [{
      content: 'I turned one less Friday Happy Hour drink into $2,800 for the Make a Wish Foundation in just one year.',
      name: 'James Maverick',
      address: 'Atlanta, GA'
    },{
      content: 'I turned one less Friday Happy Hour drink into $2,300 for the Make a Wish Foundation in just one year.',
      name: 'James Bond',
      address: 'Atlanta, GA'
    },{
      content: 'I turned one less Friday Happy Hour drink into $2,800 for the Make a Wish Foundation in just one year.',
      name: 'Akash Smith',
      address: 'Atlanta, GA'
    }];
  }

}
