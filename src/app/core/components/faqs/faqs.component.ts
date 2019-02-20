import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ContentfulService } from '../../../core/services/contentful.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  title = 'FAQ | Allgive.org';
  content = '';

  constructor( private titleService: Title, private contentfullService: ContentfulService ) { }

  ngOnInit() {
    this.setTitle(this.title);

    this.contentfullService.getTextOnlyPage('faq').then(res => {
      this.content = res.fields.textContent;
    });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
