import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
import * as moment from 'moment';

@Component({
  selector: 'surge-report-patientlist',
  templateUrl: './surge-report-patientlist.component.html',
  styleUrls: ['./surge-report-patientlist.component.css']
})
export class SurgeReportPatientlistComponent implements OnInit {

  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;

  constructor(private router: Router, private route: ActivatedRoute,
     private _location: Location, private surgeResource: SurgeResourceService) { }

  ngOnInit() {
    this.addExtraColumns();
    this.route
      .queryParams
      .subscribe((params) => {
        if (params) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.getPatientList(params);
        }
      }, (error) => {
        console.error('Error', error);
      });
  }

  private getPatientList(params: any) {
    this.surgeResource.getSurgeWeeklyReportPatientList(params.indicators, params.year_week, params.locationUuids)
        .subscribe(
          (data) => {
            this.patientData = data.results.results;
            this.isLoading = false;
            this.hasLoadedAll = true;
          }
        );
  }

  public addExtraColumns() {
    const extraColumns = {
      phone_number: 'Phone',
      enrollment_date: 'Date Enrolled',
      clinical_visit_number: 'Encounter Number since enrollment',
      last_appointment: 'Last Encounter Type',
      encounter_date: 'Last Encounter Date',
      prev_rtc_date: 'Last RTC Date',
      days_since_rtc_date: 'Days missed since RTC',
      arv_first_regimen_start_date: 'First ARV regimen start date',
      arv_first_regimen: 'AVR first regimen',
      cur_meds: 'Current Regimen',
      cur_arv_line: 'Current ARV Line',
      latest_vl: 'Latest VL',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Prevoius VL Date',
      baseline: 'Baseline status as at 31st may 2019',
      cur_status: 'Current Status',
      death_date: 'Death date',
      intervention_name: 'Intervention Name',
      intervention_date: 'Intervention Date',
      education: 'Level of Education',
      occupation: 'Occupation',
      marital_status: 'Marital Status',
      nearest_center: 'Estate/Nearest Center',
      ward: 'Ward',
      county: 'County',
    };

    for (const indicator in extraColumns) {
      if (indicator) {
        this.extraColumns.push({
          headerName: extraColumns[indicator],
          field: indicator
        });
      }
    }

    this.overrideColumns.push(
      {
        field: 'identifiers',
        cellRenderer: (column) => {
          return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
        }
      },
      {
        field: 'encounter_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      },
      {
        field: 'enrollment_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      },
      {
        field: 'prev_rtc_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      },
      {
        field: 'arv_first_regimen_start_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      }
    );
  }
  public goBack() {
    this._location.back();
  }
}
