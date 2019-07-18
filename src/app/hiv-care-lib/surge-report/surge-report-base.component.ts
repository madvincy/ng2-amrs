import * as _ from 'lodash';
import * as Moment from 'moment';

import { Component, OnInit, Output, Input } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';

@Component({
  selector: 'surge-report-base',
  templateUrl: './surge-report-base.component.html',
  styleUrls: ['./surge-report-base.component.css']
})
export class SurgeReportBaseComponent implements OnInit {
  public yearWeek: any;
  public params: any;
  public surgeWeeklyReportSummaryData: any = [];
  public columnDefs: any = [];
  public enabledControls = 'weekControl';
  public reportName = 'Surge Weekly Report';

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;

  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public surgeReport: SurgeResourceService
  ) { }

  public ngOnInit() {
  }

  public getSurgeWeeklyReport(params: any) {
    this.surgeReport
      .getSurgeWeeklyReport(params)
      .subscribe(data => {
        console.log(data, 'tets');
        this.columnDefs = data.sectionDefinitions;
        this.surgeWeeklyReportSummaryData = data.result;
        this.isLoading = false;
      });
  }

  public onIndicatorSelected(value) {
    this.router.navigate(['surge-report-patientlist'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value.field,
        indicatorHeader: value.headerName,
        year_week: this.params.year_week,
        locationUuids: this.params.locationUuids
      }
    });
  }

  public setQueryParams(params: any) {
    const queryParams = {
      'year_week': Moment(this.yearWeek).format('YYYYWW'),
      'locationUuids': params.location_uuid
    };
    this.params = queryParams;
  }

  public generateReport() {
    this.route.parent.parent.params.subscribe((params: any) => {
        this.setQueryParams(params);
    });
    this.isLoading = true;
    this.getSurgeWeeklyReport(this.params);
  }

  public onStartWeekChange(event) {
      this.yearWeek = event;
  }

}
