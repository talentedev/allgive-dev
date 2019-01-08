import { Component, OnInit, setTestabilityGetter } from '@angular/core';
// import { TitleService } from '../title.service';
import { Title } from '@angular/platform-browser';
import { ContentfulService } from '../contentful.service';
import { Entry } from 'contentful';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title: string = 'Small Sacrifice, Big Difference | Allgive.org'
  charities: Entry<any>[] = [];
  carouselType: string = 'Available Charities';

  constructor(private titleService: Title, private contentfulService: ContentfulService) { }

  ngOnInit() {
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
