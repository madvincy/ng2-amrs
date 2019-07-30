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
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public surgeWeeklyReportSummaryData: any = [];
  public columnDefs: any = [];
  public enabledControls = 'datesControl';
  public reportName = 'Surge Weekly Report';
  public currentView = 'daily';
  public isReleased = true;
  public yearWeek: any = Moment(new Date()).format('YYYY-[W]WW');

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;

  private _startDate: Date = Moment().subtract(1, 'year').toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = new Date();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }


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
    this.surgeReport.getSurgeWeeklyReport(params).subscribe(data => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.surgeWeeklyReportSummaryData = data.result;
        this.isLoading = false;
      }
    });
  }
  public getSelectedIndicators(selectedIndicator) {
    let indicators;
    if (selectedIndicator) {
      for (let i = 0; i < selectedIndicator.length; i++) {
        if (i === 0) {
          indicators = '' + selectedIndicator[i].value;
        } else {
          indicators = indicators + ',' + selectedIndicator[i].value;
        }
      }
    }
    return this.indicators = indicators;
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
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public generateReport() {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.setQueryParams(params);
    });

    this.isLoading = true;
    if (this.currentView === 'daily') {
      this.isLoading = false;
      this.surgeWeeklyReportSummaryData = [];
    } else {
      this.getSurgeWeeklyReport(this.params);
    }
  }

  public onStartWeekChange(event) {
    this.yearWeek = event;
  }

  public onTabChanged(val) {
    if (val.index === 0) {
      this.currentView = 'daily';
      this.enabledControls = 'datesControl';
    } else if (val.index === 1) {
      this.currentView = 'weekly';
      this.enabledControls = 'weekControl';
    }
  }

}
