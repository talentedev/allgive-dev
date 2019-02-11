import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ChartService } from '../../../core/services/chart.service';
import { ContentfulService } from '../../../core/services/contentful.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user;
  title = 'Dashboard | Allgive.org';
  showCharityManageView = false;
  showPaymentDetail = [false, false];
  Highcharts = Highcharts;
  donationOrgs = [];
  selectedOrg = null;
  chartOptions: object;
  updateChart = false;
  totalDonation = 0;
  totalProjection = 0;
  charityLogos = [];
  payments = [];

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private contentfullService: ContentfulService,
    private chartService: ChartService
  ) { }

  ngOnInit() {

    this.setTitle(this.title);
    this.chartOptions = this.chartService.getChartOptions([], this);

    this.userService.getUserInfo().subscribe(res => {

      this.totalDonation = this.chartService.calTotalDonation(res.contributions);
      this.totalProjection = this.chartService.calTotalProjection(res.contributions);
      this.donationOrgs = this.chartService.processSeries(res.contributions);
      this.chartOptions = this.chartService.getChartOptions(this.donationOrgs, this);
      this.updateChart = true;

      this.getCharityLogos(res.contributions);
    });

    this.userService.getUserCards().subscribe(res => {
      this.payments = res.data;
    });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  addCharity() {
    this.router.navigate(['/charities']);
  }

  getCharityLogos(data) {
    this.chartService.getCharityLogo(data).subscribe(res => {
      for (let i = 0; i < res.length; ++i) {
        this.charityLogos.push(res[i].fields.logo.fields.file.url);
      }
    });
  }

  setShowCharityManage(value, chartity=null) {
    this.showCharityManageView = value;
    this.selectedOrg = chartity;
  }

  togglePaymentDetail(index) {
    this.showPaymentDetail[index] = !this.showPaymentDetail[index];
  }

  endDate(month, year) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let todayStr = mm + '/' + dd + '/' + yyyy;
    let endDate = month + '/30/' + year

    let date1 = new Date(todayStr);
    let date2 = new Date(endDate);
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays;
  }

}
