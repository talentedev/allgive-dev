import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as marked from 'marked';

import { ContentfulService } from '../contentful.service';

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
      this.content = marked(res.fields.textContent);
    });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
