import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import * as Moment from 'moment';

import { OncologyReportService } from '../../../etl-api/oncology-reports.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

@Component({
  selector: 'oncology-reports',
  templateUrl: './oncology-reports.component.html',
  styleUrls: ['./oncology-reports.component.css']
})
export class OncologyReportsComponent implements OnInit {
  public title  = 'Reports';
  public oncologyReports: any;
  public reportType: any;
  public specificOncologyReport: any;
  public startDate: string = Moment().startOf('year').format('YYYY-MM-DD');
  public endDate: string = Moment().endOf('month').format('YYYY-MM-DD');

  constructor(
    private oncologyReportService: OncologyReportService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    let reportType: any;
    const sub = this.route.data.subscribe(v => reportType = v
    );
    console.log(reportType);
    this.getOncologyReports(reportType);
  }

  public getOncologyReports(reportType) {
    // let service = this.localStorageService.getItem('userDefaultServiceOffered');
    this.oncologyReportService.getOncologyReports(reportType).pipe(
      take(1)).subscribe((result) => {
        this.oncologyReports = result;
      }
    );
  }

  public navigateToReport(report: any, oncologyReport: any, reportIndex: number) {
    const queryParams = this.route.snapshot.params;
    const reportParams = report.reportDefaults;
    const params = {
      type: report.type,
      report: report.name
    };
    this.router.navigate(['./' + report.type + '']
      , {
           relativeTo: this.route,
           queryParams: params
     });
  }
}
