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
  showPaymentDetail = false;
  Highcharts = Highcharts;
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
            showInLegend: false
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'ASPCA',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'NATIONAL COALITION AGAINST DOME',
            y: 11.84
        }, {
            name: 'MOMA',
            y: 10.85
        }, {
            name: 'ALZEIMERS ASSOCIATION',
            y: 4.67
        }]
    }],
    credits: {
      enabled: false
    }
  };

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.setTitle(this.title);
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  setShowCharityManage(value) {
    this.showCharityManageView = value;
  }

  togglePaymentDetail() {
    this.showPaymentDetail = !this.showPaymentDetail;
  }

}
