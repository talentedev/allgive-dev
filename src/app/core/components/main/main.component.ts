import { Component, OnInit, setTestabilityGetter } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Entry } from 'contentful';

import { AuthService } from '../../../core/services/auth.service';
import { ContentfulService } from '../../../core/services/contentful.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title = 'Small Sacrifice, Big Difference | Allgive.org';
  charities: Entry<any>[] = [];
  carouselType = 'Available Charities';

  constructor(
    private titleService: Title,
    private router: Router,
    private authService: AuthService,
    private contentfulService: ContentfulService
  ) {

  }

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (this.authService.authState && val.constructor.name === 'NavigationEnd') {
        const uid = this.authService.authState.uid;
        this.authService.updateRecentActivity(uid).subscribe();
      }
    });
    this.contentfulService.getCharities()
      .then(res => {
        this.charities = res;
        this.setTitle(this.title);
      }
    );
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
