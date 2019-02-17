import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditCardComponent } from '../edit-card/edit-card.component';
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

  public loading = false;

  firstName = '';
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
  projectionPeriods = [
    'Daily Giving Total',
    'Weekly Giving Total',
    'Monthly Giving Total',
    'Quarterly Giving Total'
  ];
  selectedProjection = '2019 Year-End-Projection';
  averageProjection = '';

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private contentfullService: ContentfulService,
    private chartService: ChartService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    this.setTitle(this.title);
    this.chartOptions = this.chartService.getChartOptions([], this);

    this.init();
  }

  init() {
    this.loading = true;
    this.userService.getUserInfo().subscribe(res => {

      this.firstName = res.firstName;
      this.totalDonation = this.chartService.calTotalDonation(res.contributions);
      this.totalProjection = this.chartService.calTotalProjection(res.contributions);
      this.averageProjection = this.totalProjection.toString();
      this.donationOrgs = this.chartService.processSeries(res.contributions);
      this.chartOptions = this.chartService.getChartOptions(this.donationOrgs, this);
      this.updateChart = true;
      this.payments = res.cards;
      this.loading = false;

      this.getCharityLogos(res.contributions);
    });
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  setProjectionPeriod(index) {
    this.selectedProjection = this.projectionPeriods[index];
    switch (index) {
      case 0:
        this.averageProjection = '~$' + (this.totalProjection / 365).toFixed(2) + '/day';
        break;
      case 1:
        this.averageProjection = '~$' + (this.totalProjection / 52).toFixed(2) + '/week';
        break;
      case 2:
        this.averageProjection = '~$' + (this.totalProjection / 12).toFixed(2) + '/month';
        break;
      case 3:
        this.averageProjection = '~$' + (this.totalProjection / 4).toFixed(2) + '/quarter';
        break;
      default:
        this.averageProjection = '';
        break;
    }
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

  editCard(card) {
    const modalRef = this.modalService.open(EditCardComponent, { centered: true });
    modalRef.componentInstance.card = card;
    modalRef.result.then(result => {
      console.log('open');
    }, reason => {
      if (reason == 'success') {
        this.init();
      }
    });
  }

}
