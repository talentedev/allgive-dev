import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin';

import { ContentfulService } from '../../contentful.service';

@Injectable()
export class ChartService {

  constructor(private contentfullService: ContentfulService) { }

  // Return char options with series data and binding method.
  getChartOptions(series, client) {
    const chartOptions = {
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
        pointFormat: '<b>{point.percentage:.1f}%</b>'
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
              client.clickChart(e);
            }.bind(client)
          }
        }
      },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: series,
        point: {
          events: {
            mouseOver: function(e) {
              client.selectedOrg = e.target.index;
            }.bind(client),
            mouseOut: function(e) {
              client.selectedOrg = -1;
            }.bind(client)
          }
        }
      }],
      credits: {
        enabled: false
      }
    };
    return chartOptions;
  }

  // Process data to adopt highchart options.
  processSeries(data) {
    var totalDonation = this.calTotalDonation(data);
    var series = [];
    for (var i = 0; i < data.length; ++i) {
      var section = {};
      section['name'] = data[i].charitie;
      section['y'] = data[i].total/totalDonation*100;
      section['amount'] = data[i].total;
      section['projection'] = data[i].projection;
      section['daily'] = data[i].daily;
      series.push(section);
    }
    return series;
  }

  // Calculate total donation amount.
  calTotalDonation(data) {
    var totalDonation = 0;
    for (var i = 0; i < data.length; ++i) {
      totalDonation += data[i].total;
    }
    return totalDonation;
  }

  // Calculate total year projection.
  calTotalProjection(data) {
    var total = 0;
    for (var i = 0; i < data.length; ++i) {
      total += data[i].projection;
    }
    return total;
  }

  // Get charitiy logo
  getCharityLogo(data): Observable<any[]> {
    var responses = [];
    for (var i = 0; i < data.length; ++i) {
      let slug = data[i].charitie.toLowerCase().split(' ').join('-');
      responses.push(this.contentfullService.getCharityDetail(slug));
    }
    return Observable.forkJoin(responses);
  }
}
