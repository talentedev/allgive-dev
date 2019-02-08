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
  payments = [
    {
      type: 'Visa',
      expire: '04/2021',
      default: true,
      icon: '../../../assets/images/visa.png'
    },
    {
      type: 'Master Card',
      expire: '02/2019',
      icon: '../../../assets/images/master-card.png'
    }
  ];

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
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  clickChart(e) {
    // this.selectedOrg = (e.point.selected === undefined || e.point.selected === false) ? e.point.index : -1;
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

  setShowCharityManage(value) {
    this.showCharityManageView = value;
  }

  togglePaymentDetail(index) {
    this.showPaymentDetail[index] = !this.showPaymentDetail[index];
  }

}
