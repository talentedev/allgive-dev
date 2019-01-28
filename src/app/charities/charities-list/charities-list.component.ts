import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ContentfulService } from '../../contentful.service';
import { EntryCollection, Entry } from 'contentful';

@Component({
  selector: 'app-charities-list',
  templateUrl: './charities-list.component.html',
  styleUrls: ['./charities-list.component.css'],
})
export class CharitiesListComponent implements OnInit {

  charities: Entry<any>[] = [];
  filteredCharities: Entry<any>[] = [];
  categories: Entry<any>[] = [];
  filteredCategories: Entry<any>[] = [];
  activeCategory;
  featuredCharity;
  showAll = true;
  coverStyle: {};
  title = 'All Charities | Allgive.org';

  constructor(private titleService: Title, private contentfulService: ContentfulService) { }

  ngOnInit() {
    this.getAllCharities()
    .then(res => {
      this.coverStyle = {
        'background-image': 'url(' + this.featuredCharity.fields.coverImage.fields.file.url + ')'
      };
    });

    this.setTitle(this.title);

    this.contentfulService.getCategories()
      .then(res => {
        this.categories = res;
        this.filteredCategories = res;
      });

    this.activeCategory = 'Category';
  }

  getCategory(category) {
    return this.contentfulService.getCategory(category)
      .then(res => this.activeCategory = res.fields.categoryName);
  }

  getAllCharities() {
    return this.contentfulService.getCharities()
      .then(res => {
        this.charities = res;
        this.filteredCharities = res;
        this.showAll = true;
        this.activeCategory = 'Category';
        this.featuredCharity = res[Math.floor(Math.random() * res.length)];
      });
  }

  getCharitiesByCategory(category) {
    return this.contentfulService.getCharitiesByCategory(category)
      .then(res => {
        this.charities = res;
        this.showAll = false;
        this.getCategory(category);
      });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onSearchChange(searchValue: string) {
    const categories = this.categories.filter(function (category) {
      return category.fields.categoryName.toLowerCase().includes(searchValue);
    });
    this.filteredCategories = categories;
  }

  onSearchCharity(searchValue: string) {
    const charities = this.charities.filter(function (charity) {
      return charity.fields.charityName.toLowerCase().includes(searchValue);
    });
    this.filteredCharities = charities;
  }
}
