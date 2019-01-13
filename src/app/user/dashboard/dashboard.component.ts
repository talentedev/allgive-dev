import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

import { AuthService } from '../../auth.service';

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
  chartOptions = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: '#e9ecef'
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: false,
            events: {
              click: function(e) {
                this.clickChart(e);
              }.bind(this)
            }
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: []
    }],
    credits: {
      enabled: false
    }
  };
  updateChart = false;
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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.setTitle(this.title);

    // To Do : get data from api
    this.donationOrgs = [{
            name: 'ASPCA',
            y: 61.41,
            amount: 1281
        }, {
            name: 'NATIONAL COALITION AGAINST DOMESTIC VIOLENCE',
            y: 11.84,
            amount: 414
        }, {
            name: 'MOMA',
            y: 10.85,
            amount: 625
        }, {
            name: 'ALZEIMERS ASSOCIATION',
            y: 4.67,
            amount: 1070
        }];

    this.chartOptions.series[0].data = this.donationOrgs;
    this.updateChart = true;
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  clickChart(e) {
    this.selectedOrg = (e.point.selected === undefined || e.point.selected === false) ? e.point.index : -1;
  }

  setShowCharityManage(value) {
    this.showCharityManageView = value;
  }

  togglePaymentDetail(index) {
    this.showPaymentDetail[index] = !this.showPaymentDetail[index];
  }

}
